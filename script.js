require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/support/LabelClass",
  "esri/widgets/Legend",
  "esri/widgets/Search",
  "esri/widgets/LayerList"
], function(Map, MapView, FeatureLayer, LabelClass, Legend, Search, LayerList) {

  const map = new Map({
      basemap: "dark-gray"
  });

  const view = new MapView({
      container: "viewDiv",
      map: map,
      extent: {
          xmin: -12500000,
          ymin: 3000000,
          xmax: -7000000,
          ymax: 6500000,
          spatialReference: 102100
      }
  });

  //Creating a US State Boundary layer from web feature service and displaying the content
  var featureLayer_1 = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Boundaries_2022/FeatureServer/1",
      renderer: {
          type: "simple",
          symbol: {
              type: "simple-fill",
              color: "transparent",
              outline: {
                  color: "blue",
                  width: 2
              }
          }
      },
      popupTemplate: {
          title: "State: {STATE_NAME}",
          content: "Population 2022: {POPULATION_2022}"
      }
  });

  // Creating the Forest Fire Layer and displaying the Content
  map.add(featureLayer_1);

  var featureLayer_2 = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/MTBS_Polygons_v1/FeatureServer/0",
      popupTemplate: {
          title: "{FireName}",
          content: "Acres Burned: {Acres}"
      }
  });

  map.add(featureLayer_2);


  // Creating the Emergency Response Centre and Displaying the content
  var featureLayer_3 = new FeatureLayer({
    url: "https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0",
    outFields: ["*"],
    popupTemplate: {
        title: "{NAME}",
        content: "Address: {ADDRESS}<br>Telephone: {TELEPHONE}<br>State: {STATE}"
    },
    renderer: {
        type: "simple", // Using a simple renderer for individual points
        symbol: {
            type: "simple-marker", // Use a simple marker symbol
            size: 8, // Setting the Size of the marker
            color: "lightblue", // Light blue color for the marker
            outline: { // Defining an outline for the marker
                width: 0.5,
                color: "white"
            }
        }
    },
    featureReduction: {
        type: "cluster",
        clusterRadius: "100px",
        popupTemplate: {
            content: "This cluster represents {cluster_count} emergency operations centers"
        },
        clusterSymbol: {
            type: "simple-marker",
            color: [0, 0, 0, 0], // Transparent color for cluster symbol to focus on individual markers
            outline: {
                color: "lightblue",
                width: 1
            }
        },
        clusterMinSize: "24px",
        clusterMaxSize: "60px",
        labelingInfo: [{
            deconflictionStrategy: "none",
            labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
                type: "text",
                color: "#000000",
                font: {
                    weight: "bold",
                    family: "Noto Sans",
                    size: "12px"
                }
            },
            labelPlacement: "center-center",
        }]
    }
});

map.add(featureLayer_3);

  // Creating the Legend widget with the specified layers
  const legend = new Legend({
    view: view,
    layerInfos: [
        {
            layer: featureLayer_1,
            title: "US Boundaries"
        },
        {
            layer: featureLayer_2,
            title: "Forest Fires"
        },
        {
            layer: featureLayer_3,
            title: "Emergency Operations Centers"
        }
    ]
});

// Adding the legend to the bottom right corner of the view
view.ui.add(legend, "bottom-right");

  // Creating the Search widget
  const searchWidget = new Search({
    view: view
});

// Adding the search widget to the top right corner of the view
view.ui.add(searchWidget, {
    position: "top-right"
});

const layerList = new LayerList({
  view: view,
  // layers: [{ layer: featureLayer_1 }, { layer: featureLayer_2 }, { layer: featureLayer_3 }],
  // Including legend information within the LayerList
  listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type !== "group") { // Avoid adding legend for group layers
          // Providing a way to display the layer's legend in the LayerList item
          item.panel = {
              content: "legend",
              open: false 
          };
      }
  }
});

// Adding the LayerList to the map's UI
view.ui.add(layerList, {
    position: "top-left"
});

});