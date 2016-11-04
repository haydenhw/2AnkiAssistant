var BASE_URL = "https://glosbe.com/gapi/translate";

function getApiData(searchString, callback){
	var query = {
		from: "eng",
		dest: "spa",
		format: "json",
		phrase: "apple",
		pretty: true

	}
	$.getJSON(BASE_URL, query, callback);
}

function processSearchResults(data) {
	var searchResults = {
		translation: data.tuc[0].phrase.text,
		nativeDef: data.tuc[0].meanings[2].text,
		targetDef: data.tuc[0].meanings[1].text,
	}
		
	//renderSearchResults(searchResults);
}

function submitHandler(state) {
	$("form").submit(function(e){
		e.preventDefault();
		var searchString = $("input[name='js-vidSearch']").val();
		state.term = searchString;
		getApiData(searchString, processSearchResults);
	});	
}



$(submitHandler());