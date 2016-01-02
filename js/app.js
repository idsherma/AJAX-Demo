// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){ 
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var showTopAnswerers = function (item) {

    // clone our result template code
    var result = $('.templates .answerers').clone();

    // Set the top answerer properties in result
    var userName = result.find('.user-name a');
    var userProfileImage = result.find('.user-profile-image');
    var postCount = result.find('.post-count');
    var reputation = result.find('.reputation');
    var acceptRate = result.find('.accept-rate');

    //display results
    userName.text(item.user.display_name);
    userName.attr("href", item.user.link);
    userProfileImage.attr("src", item.user.profile_image);
    postCount.text(item.post_count);
    reputation.text(item.user.reputation);
    acceptRate.text(item.user.accept_rate + "%");

    return result;
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


var getTopAnswerers = function (tags) {
  
    // the parameters we need to pass in our request to StackOverflow's API
    var request = {
        tagged: tags,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'creation'
    };


    var result = $.ajax({
        url: "http://api.stackexchange.com/2.2/tags/"+request.tagged+"/top-answerers/all_time",
        data: request,
        dataType: "jsonp",
        type: "GET",
    })
	.done(function (result) {
	    var searchResults = showSearchResults(request.tagged, result.items.length);

	    $('.search-results').html(searchResults);

	    $.each(result.items, function (i, item) {
	        
	        var answerer = showTopAnswerers(item);
	        $('.results').append(answerer);
	    });
	})
	.fail(function (jqXHR, error, errorThrown) {
	    var errorElem = showError(error);
	    $('.search-results').append(errorElem);
	});
};

$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.question').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getTopAnswerers(tags);
	});
});

//***PART 2***//

var showTopAnswerers = function (item) {

var result = $('.templates .inspiration').clone();
    var user = result.find('.user a')
        .attr('href', item.user.link)
        .text(item.user.display_name);
    var image = "<img src='" + item.user.profile_image + "' alt='" + item.user.display_name + "'>";
    $(user).append(image);
    result.find('.post-count').text(item.post_count);
    result.find('.score').text(item.score);

    return result;
};

// this function takes the results object from StackOverflow
// creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
var getUnanswered = function(tags) {
	
	// parameters
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


var getTopAnswerers = function (tags) {
  
    // parameters
    var request = {
        tagged: tags,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'creation'
    };

    var result = $.ajax({
        url: "http://api.stackexchange.com/2.2/tags/"+request.tagged+"/top-answerers/all_time",
        data: request,
        dataType: "jsonp",
        type: "GET",
    })
	.done(function (result) {
	    var searchResults = showSearchResults(request.tagged, result.items.length);

	    $('.search-results').html(searchResults);

	    $.each(result.items, function (i, item) {
	        
	        var answerer = showTopAnswerers(item);
	        console.log(answerer);
	        $('.results').append(answerer);
	    });
	})
	.fail(function (jqXHR, error, errorThrown) {
	    var errorElem = showError(error);
	    $('.search-results').append(errorElem);
	});
};








