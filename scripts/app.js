var state = {
	currTerm: null,
	wordList: []
}

function processSearchResults(state, term, elements) {
	return function(data) {
		var termData = {
			term: term, 
 			translation: data.tuc[0].phrase.text,
 			nativeDef: data.tuc[0].meanings[2].text,
 			targetDef: data.tuc[0].meanings[1].text,
	 	}

	state.currTerm = termData; 	
	renderSearchResults(termData, elements);
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

function listToString(list){
	return list.reduce(function (av, cv){
		return av + cv.term + " ; " + cv.translation + "\n"
	}, "")
}

function renderSearchResults(termData, elements){
		elements.term.text(termData.term);
		elements.trans.text(termData.translation);	
		elements.nativeDef.text(termData.nativeDef);	
		elements.targetDef.text(termData.targetDef);	
}


function renderList(state){


	var listHTML = state.wordList.map(term =>
			"<div class='listItem'>"+
			"	<div class='term inline'>" + term.term +"</div>"+
			"	<div class='trans inline'>" + term.translation + "</div>"+
			"<button class='inline' name='removeTerm'>Remove</button>"+
			"</div>"
		);

	$(".js-list").html(listHTML);
	$(".js-list").append("<button name='convert'>Convert!</button>");
}

function submitHandler(state, BASE_URL, elements) {
	$("form").submit(function(e){
		e.preventDefault();
		var searchString = $("input[name='js-vidSearch']").val();
		getApiData(state, BASE_URL, searchString, processSearchResults, elements);
	});	
}

function addTermHandler(state) {
	$(".js-addTerm").click(function(){
		state.wordList.push(state.currTerm);
		renderList(state);
	});
}

function removeTermHandler(state){
	$(".js-list").on("click", "button[name='removeTerm']" ,function(){
		console.log("hello");
		//removeTerm(state);
	});
}

function renderTextArea(output, elements){
	var textAreaHTML = "<textarea rows='50' cols='50'></textarea>";
	elements.textArea.html(textAreaHTML);
	elements.textArea.find("textarea").val(output);
}

function convertHandler(state, elements){
	$(".js-list").on("click", "button[name='convert']", function(){
		var output = listToString(state.wordList)
		renderTextArea(output, elements);
		console.log(output);
	});
}

function main() {
	var BASE_URL = "https://glosbe.com/gapi/translate?callback=?";
	var elements = {
		results: $(".js-results"),
		termTrans: $(".js-termTrans"),
		trans: $(".js-trans"),
		term: $(".js-term"),
		nativeDef: $(".js-nativeDef"),
		targetDef: $(".js-targetDef"),
		textArea: $(".js-textArea")
	}
	submitHandler (state, BASE_URL, elements);
	addTermHandler(state);
	removeTermHandler(state);
	convertHandler(state, elements);

}


$(main());