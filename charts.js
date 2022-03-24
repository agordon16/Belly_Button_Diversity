function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples= data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var results = samples.filter(sampleObj => sampleObj.id ==sample);
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var initialSample = results[0];
    var metaResult = metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = initialSample.otu_ids;
    var otu_labels = initialSample.otu_labels;
    var sample_values = initialSample.sample_values;
    var wash = metaResult.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.map(sample=> "OTU" + " "  + sample).slice(0,10).reverse()
    
    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      text: otu_labels,
      orientation: 'h'
      };
    var data = [barTrace];
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "<b>Top Ten Belly Bacteria",
      font: {
        family: 'Courier New, monospace',
        size: 12,
        color: 'rgb(0,0,255)'
      },
      xaxis: { title: "Bacteria Counts" },
      yaxis: { title: "OTU ID" }, 
      plot_bgcolor:"PowderBlue",
      paper_bgcolor:"PowderBlue",
      };
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);

    // Bar and Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
      },
      
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample",
      font: {
        family: 'Courier New, monospace',
        size: 18,
        color: 'green'
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      plot_bgcolor:"HoneyDew",
      paper_bgcolor:"HoneyDew",
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    
      // 2. Use d3.json to load and retrieve the samples.json file 
      
        
    
    // 2. Create a variable that holds the first sample in the metadata array.
     

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    
         
       
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency <br>(Scrubs Per Week)"},
      gauge: {
        bar: {color: 'black'},
        axis: {range: [null,10]},
        steps: [
          {range : [0,2], color: "palegreen"},
          {range : [2,4], color: "lightskyblue"},
          {range : [4,6], color: "hotpink"},
          {range : [6,8], color: "mediumpurple"},
          {range : [8,10], color: "silver"}
        ],
      }

    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 400,
      margin: { t: 25, b: 25, l: 25, r: 25 },
      plot_bgcolor:"pink",
      paper_bgcolor:"pink",
      font: {
        family: 'Courier New, monospace',
        color: 'rgb(128,0,255)'
        
      },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout );
  });
  }

 