var state = {
	currTerm: null,
	wordList: [],
	errorMessages: {
		emptySearch: "Please enter a search term",
		termNotFound: "Sorry, we don't have a traslation for that term.<br>Please check for spelling errors or try another term." 
					  
	}
}

function processSearchResults(state, term, elements) {
	return function(data) {

		var Term = function(term, trans) {
			this.term = term;
			this.translation = trans;
		}

		if(data.tuc[0]){
			state.currTerm =  new Term(term, data.tuc[0].phrase.text) 	
			renderSearchResults(state.currTerm, elements);
	 	}	
		else {
			renderError(state.errorMessages.termNotFound, elements)
		}
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
};

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


function renderItem(state, term, trans, idx){
	var template = $(
		"<div class='js-listItem listItem'>" +
		"	<div class='js-term term inline'></div>"+
		"	<div class='js-trans trans inline'></div>"+
		"<button class='inline' name='removeTerm'>X</button>"+
		"</div>");

	template.find(".js-term").text(term);
	template.find(".js-trans").text(trans);
	template.find("button[name='removeTerm']").click(function(){
		removeTerm(state, idx);
	});

	return template;	
}



function renderList(state){
		var listHTML = state.wordList.map((term, idx) =>
			renderItem(state, term.term, term.translation, idx)
		);

	$(".js-list").html(listHTML);
}

function renderError(msg, elements){
	elements.error.html(msg);
}

function renderTextArea(output, elements){
	var msg = "Almost done! Now just copy and paste this semicolon-separated list into a text file on your desktop and import into Anki."
	var textAreaHTML = "<textarea rows='50' cols='50'></textarea>";
	elements.instructions.html(msg);
	elements.textArea.html(textAreaHTML);
	elements.textArea.find("textarea").val(output);
}

function initSubmitHandler (state, BASE_URL, elements) {
	$("form").submit(function(e){
		var searchString = $("input[name='js-vidSearch']").val();
		e.preventDefault();
		renderError("", elements);
		elements.results.html("").removeClass("results");

		if(searchString){
			getApiData(state, BASE_URL, searchString, processSearchResults, elements);
		}
		else{
			renderError(state.errorMessages.emptySearch, elements);
		}
		this.reset();
	});	
}

function initAddTermHandler(state) {
	$(".js-results").on("click", "button" ,function(){
		state.wordList.push(state.currTerm);
		renderList(state);
	});
}

function initConvertHandler(state, elements){
	$("button[name='convert']").on("click", function(){
		var output = listToString(state.wordList)
		renderTextArea(output, elements);
	});
}

function main() {
	var BASE_URL = "https://glosbe.com/gapi/translate?callback=?";
	var elements = {
		results: $(".js-results"),
		textArea: $(".js-textArea"),
		instructions: $(".js-instructions"),
		error: $(".js-error"),
		termTrans: ".js-termTrans",
		trans: ".js-trans",
		term: ".js-term",
		nativeDef: ".js-nativeDef",
		targetDef: ".js-targetDef"
	}

	initSubmitHandler(state, BASE_URL, elements);
	initAddTermHandler(state);
	initConvertHandler(state, elements);	
}

$(main());