const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let responseNames;
let responseSamples;
let responseMetadata; 
Plotly.d3.json(dataUrl, function(error, response) {
  responseNames = response.names;
  responseSamples = response.samples;
  responseMetadata = response.metadata;
  //console.log(response);
  console.log(response.names);
  console.log(response.metadata);
  console.log(response.samples);
  //show information for first selected sample
  populateIdDropdown(response.names);
  optionChanged(response.names[0]);
});

//filter to get sample on id
function filterSample(sample) {
  return sample.id == this;
}

//change sample event handler
function optionChanged(subjectId) {
  showDemographicInfo(subjectId);
  plotBubbleChart(subjectId);
  plotPieChart(subjectId);
  plotBarChart(subjectId);
}

//Show Drop Down with Names
function populateIdDropdown(names) {
  //console.log(names);
  //populate subject id drop down
  let subjectIdDropDown = document.getElementById("selDataset");
  let dropOption;
  //loop through names
  for(key in names) {
    dropOption = document.createElement("option");
    dropOption.text = names[key];
    dropOption.value = names[key];
    subjectIdDropDown.add(dropOption);
  }
}

//sho demographic info
function showDemographicInfo(subjectID) {
  //console.log(responseMetadata.find(filterSample,subjectID));
  var demographicDiv = document.getElementById("sample-metadata");
  var innerHtmlTable = "";
  let sampleMetadataInfo = responseMetadata.find(filterSample,subjectID);
  for(key in sampleMetadataInfo) {
    innerHtmlTable += "<b>" + key + ": </b>"+ sampleMetadataInfo[key] + "<br>";
  }
  demographicDiv.innerHTML = innerHtmlTable;
}

//plot pie chart
function plotPieChart(subjectID) {
  //get sample info
  let sampleValues = responseSamples.find(filterSample,subjectID).sample_values;
  //draw chart
  var data = [{
    values: sampleValues.slice(0,9),
    labels: sampleValues.slice(0,9),
    type: 'pie'
  }];
  var layout = {
    height: 400,
    width: 500
  };
  Plotly.newPlot("gauge", data, layout);
}

//plot bar chart Pie
function plotBarChart(subjectID) {
  //get sample info
  let sampleInfo = responseSamples.find(filterSample,subjectID);
  let sampleValues = sampleInfo.sample_values;
  let otuLables = sampleInfo.otu_labels;
  let otuIds = sampleInfo.otu_ids;
  
  //sort for top 10 balues
  otuIds.sort();
  otuIds.reverse();
  sampleValues.sort();
  sampleValues.reverse();
  
  //draw chart
  var trace1 = {
    x: sampleValues.slice(0,9),
    y: otuIds.slice(0,9),
    type: 'bar',
    text: otuLables,
    orientation: 'h',
    marker: {
      color: 'rgb(142,124,195)',
    }
  };

  var data = [trace1];
  var layout = {
    height: 400,
    width: 500
  };
  Plotly.newPlot("bar", data, layout);
}

// bubble chart
function plotBubbleChart(subjectID) {
  //get sample info
  let sampleInfo = responseSamples.find(filterSample,subjectID);

  var trace1 = {
    x: sampleInfo.otu_ids,
    y: sampleInfo.sample_values,
    text: sampleInfo.otu_labels,
    type: 'bubble',
    mode: 'markers',
    marker: {
      color: sampleInfo.otu_ids,
      size: sampleInfo.sample_values
    }
  };

  var data = [trace1];

  var layout = {
    title: 'Belly Button Bubble Chart',
    showlegend: false,
    height: 600,
    width: 1000
  };

  Plotly.newPlot('bubble', data, layout);
}