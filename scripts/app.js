var state = {
	currTerm: null,
	wordList: [],
	errorMessages: {
		emptySearch: "Please enter a search term",
		termNotFound: "Sorry, we don't have a traslation for that term.<br>" +
		 			  "Please check for spelling errors or try another term."
					  
	}
}

function processSearchResults(state, term, elements) {
	return function(data) {
		if(data.tuc[0]){
			var termData = {
				term: term, 
	 			translation: data.tuc[0].phrase.text,
	 			nativeDef: data.tuc[0].meanings[2].text,
	 			targetDef: data.tuc[0].meanings[1].text
	 		}
	 		state.currTerm = termData; 	
			renderSearchResults(termData, elements);
	 	}	
		else {
			renderError(state.errorMessages.termNotFound, elements)
		}
	//For Testing
		// state.wordList.push(state.currTerm);
		// renderList(state);	
	}
}


function getApiData(state, BASE_URL, searchString, callback, elements){
	var elementObj = elements;
	var term = searchString;
	var state = state;
	var query = {
		from: "eng",
		dest: "spa",
		format: "json",
		phrase: searchString,
		pretty: true
	}

	$.getJSON(BASE_URL, query, callback(state, term, elementObj));
}

function removeTerm(state, idx){
	state.wordList.splice(idx,1);
	renderList(state); 
}

function listToString(list){
	return list.reduce(function (av, cv){
		return av + cv.term + " ; " + cv.translation + "\n"
	}, "")
}

function renderSearchResults(termData, elements){
	var template = $(	
	
	"<div>"+
		"<div class='js-termTrans termTrans'>"+
			"<div class='js-term term inline'></div>"+
			"<div class='js-trans trans inline'></div>"+
			"<button class='js-addTerm inline' name='addTerm'>Add</button>"+
		"</div>"+
		"<div class='js-native def'></div>"+
		"<div class='js-target def'></div>"+		
	"</div>"
	);
	
	template.find(elements.term).text(termData.term);
	template.find(elements.trans).text(termData.translation);	
	template.find(".js-native").text(termData.nativeDef);	
	template.find(".js-target").text(termData.targetDef);	

	elements.results.html(template).addClass("results");
}


function renderItem(term, trans, idx){
	var template = $(
		"<div class='js-listItem listItem'>" +
		"	<div class='js-term term inline'></div>"+
		"	<div class='js-trans trans inline'></div>"+
		"<button class='inline' name='removeTerm'>X</button>"+
		"</div>");

	template.find(".js-term").text(term);
	template.find(".js-trans").text(trans);
	template.find(".js-term").attr("id", idx);
	

	return template;	
}



function renderList(state){
		var listHTML = state.wordList.map((term, idx) =>
			renderItem(term.term, term.translation, idx)
		);

	$(".js-list").html(listHTML);
}

function renderError(msg, elements){
	console.log(msg);
	elements.error.text(msg);
	elements.error.html(msg);
}

function renderTextArea(output, elements){
	//var msg = "Add to your list by searching for a word and clicking the add button"
	var textAreaHTML = "<textarea class='module' rows='50' cols='50'></textarea>";
	elements.textArea.html(textAreaHTML);
	elements.textArea.find("textarea").val(output);
}

function submitHandler(state, BASE_URL, elements) {
	$("form").submit(function(e){
		e.preventDefault();
		renderError("", elements);
		elements.results.html("").removeClass("results");
		var searchString = $("input[name='js-vidSearch']").val();
		if(searchString){
			getApiData(state, BASE_URL, searchString, processSearchResults, elements);
		}
		else{
			renderError(state.errorMessages.emptySearch, elements);
		}
		this.reset();
	});	
}

function addTermHandler(state) {
	$(".js-results").on("click", "button" ,function(){
		state.wordList.push(state.currTerm);
		renderList(state);
	});
}

function removeTermHandler(state){
	$(".js-list").on("click", "button[name='removeTerm']" ,function(){
		var id = $(this).parent().find(".js-term").attr("id");//.css({"color": "red", "border": "2px solid red"});
		removeTerm(state, id);
	});
}


function convertHandler(state, elements){
	$("button[name='convert']").on("click", function(){
		var output = listToString(state.wordList)
		renderTextArea(output, elements);
		console.log(output);
	});
}

function main() {
	var BASE_URL = "https://glosbe.com/gapi/translate?callback=?";
	var elements = {
		results: $(".js-results"),
		termTrans: ".js-termTrans",
		trans: ".js-trans",
		term: ".js-term",
		nativeDef: ".js-nativeDef",
		targetDef: ".js-targetDef",
		textArea: $(".js-textArea"),
		error: $(".js-error")
	}
	submitHandler (state, BASE_URL, elements);
	addTermHandler(state);
	removeTermHandler(state);
	convertHandler(state, elements);
	/*$(".js-list").attr("id", 2)
	var out = $(".js-list").attr("id");
	console.log(out);*/

	//For Testing
	getApiData(state, BASE_URL, "apple" , processSearchResults, elements);
	
	
}


$(main());