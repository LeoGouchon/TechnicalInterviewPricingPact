var axios = require("axios");
var ejs = require('ejs');
var fs = require('fs');

async function getData() {
	try {
		const response = await axios.get(
			'https://medium.com/search?q=pricing'
		)
    //console.log(response);
    Process(response.data);
	} catch (error) {
		console.error(error)
	}
}

//Extract data from the axios request
function Process(ExtractData){
  Data = JSON.parse(ExtractData.substring(ExtractData.indexOf("{")));

  //
  //
  //Extract ID
  PostData = Data.payload.value.posts;
  AllId = [];
  for (i = 0; i< PostData.length; i++){
    AllId.push(PostData[i].id);
  }
  //console.log(AllId);

  //
  //
  //Extract SubTitle
  AllSubtitle = [];
  for (i = 0; i< PostData.length; i++){
    AllSubtitle.push(PostData[i].virtuals.subtitle);
  }
  //console.log(AllSubtitle);

  //
  //
  //Extract Author
  AllAuthor = [];
  for (i = 0; i< PostData.length; i++){
    idAuthor = (PostData[i].creatorId);
    //console.log(idAuthor);
    //console.log(Data.payload.references.User[idAuthor]);
    AllAuthor.push(Data.payload.references.User[idAuthor].name);
    //console.log(Data.payload.references.User)
  }
  //console.log(AllAuthor);

  //
  //
  //Extract Date
  AllDate = [];
  for (i = 0; i< PostData.length; i++){
    AllDate.push(new Date(PostData[i].createdAt));
  }
  //console.log(AllDate);

  //
  //
  //Once all data from all articles extract, we add all informations on json file
  content = [];
  for(i = 0; i < AllId.length; i++){
    article = {
      id :AllId[i],
      date :AllDate[i],
      author :AllAuthor[i],
      description :AllSubtitle[i]
    }
    content.push(article);
  }
  //console.log(content)
  MakeJsonFile(content)
}

//Create part of json file for one article
function MakeJsonFile(content){
  let Article = JSON.stringify(content, null, 2);
  fs.writeFileSync('Data.json', Article);
}



//
//Main Code
ExtractData = getData();
