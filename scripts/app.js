

function getApiData(BASE_URL, searchString, elements, callback){
	var elementObj = elements;
	var term = searchString;
	var query = {
		from: "eng",
		dest: "spa",
		format: "json",
		phrase: searchString,
		pretty: true
	}

	$.getJSON(BASE_URL, query, callback(term, elementObj));
}

function renderSearchResults(term, elements) {
	return function(data) {
		console.log(term);	
		var translation = data.tuc[0].phrase.text;
		var nativeDef = data.tuc[0].meanings[2].text;
		var targetDef = data.tuc[0].meanings[1].text;
		elements.term.text(term);
		elements.trans.text(translation);	
		elements.nativeDef.text(nativeDef);	
		elements.targetDef.text(targetDef);	
	}
}

function submitHandler(BASE_URL, elements) {
	$("form").submit(function(e){
		e.preventDefault();
		var searchString = $("input[name='js-vidSearch']").val();
		getApiData(BASE_URL, searchString, elements, renderSearchResults);
	});	
}

function main() {
	var BASE_URL = "https://glosbe.com/gapi/translate";
	var elements = {
		results: $(".js-results"),
		termTrans: $(".js-termTrans"),
		trans: $(".js-trans"),
		term: $(".js-term"),
		nativeDef: $(".js-nativeDef"),
		targetDef: $(".js-targetDef")
	}
	submitHandler (BASE_URL, elements);
	//elements.term.text("hello");
}


$(main());