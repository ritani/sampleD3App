define(['text!templates/dataPoint/d3Anim.html',
        'text!templates/dataPoint/info.html',
        'text!templates/dataPoint/key.html'],
function(template, infoTemplate, keyTemplate) {
    var D3AnimView = Backbone.View.extend({
        template: Handlebars.compile(template),

        className: 'd3AnimView',

        events: {
            "click .playStop":"playStop",
            "click .dot":"displayInfo"
        },

        initialize: function(options) {
            this.infoTemplate = Handlebars.compile(infoTemplate);
            this.keyTemplate = Handlebars.compile(keyTemplate);

            this.yearRange = [2007, 2010]
            this.xLabel = "Children Per Woman";

            this.render();
        },

        render: function() {
            this.$el.html(this.template());
            this.renderChart();
            return this;
        },


        chartConfig: function() {
            var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 69.5},
                width = 960 - margin.right,
                height = 500 - margin.top - margin.bottom,
                xScale = d3.scale.linear().domain([0, 7]).range([0, width]),
                yScale = d3.scale.linear().domain([94, 101]).range([height, 0]);

            return {
                // Chart dimensions.
                margin: margin,
                width: width,
                height: height,

                // Various scales. These domains make assumptions of data, naturally.
                xScale: xScale,
                yScale: yScale,

                radiusScale: d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
                colorScale: d3.scale.category10(),

                // The x & y axes.
                xAxis: d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
                yAxis: d3.svg.axis().scale(yScale).orient("left"),

                xLabel: "Children Per Woman",
                yLabel: "Child Survival Rate (percent)",

                regions: ["North America", "Asia", "Pacific"]
            };
        },

        renderChart: function() {
            var config = this.chartConfig();

            this.svg = d3.select(this.$("#chart")[0]).append("svg")
                .attr("width", config.width + config.margin.left + config.margin.right)
                .attr("height", config.height + config.margin.top + config.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

            // Add the x-axis.
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + config.height + ")")
                .call(config.xAxis);

            // Add the y-axis.
            this.svg.append("g")
                .attr("class", "y axis")
                .call(config.yAxis);

            // Add an x-axis label.
            this.svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", config.width)
                .attr("y", config.height - 6)
                .text(config.xLabel);

            // Add a y-axis label.
            this.svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 6)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .text(config.yLabel);

            // Add the year label; the value is set on transition.
            this.label = 
                d3.select(this.$(".year.label")[0])
                .attr("class", "year label")
                .attr("text-anchor", "end")
                .attr("y", config.height - 24)
                .attr("x", config.width)
                .text(this.yearRange[0]);


            _.each(config.regions, function(region) {
                this.$(".regions").append(this.keyTemplate({"color":config.colorScale(region), "region":region}))
            }, this);

            this.renderData(config);
        },

        renderData: function(config) {
            var self = this;

            // Various accessors that specify the four dimensions of data to visualize.
            var x = function(d) { return d.chidrenPerWoman; },
                y = function(d) { return d.childSurvivalRate; },
                radius = function(d) { return d.population; },
                color = function(d) { return d.region; },
                key = function(d) { return d.name; };

            //d3.json("/api/v1/data", function(items) { // load from json file
            var computeData = function(items) { // load from collection

                // Positions the dots based on data.
                var position = function(dot) {
                    dot.attr("cx", function(d) { return config.xScale(x(d)); })
                        .attr("cy", function(d) { return config.yScale(y(d)); })
                        .attr("r", function(d) { return config.radiusScale(radius(d)); });
                };

                // Defines a sort order so that the smallest dots are drawn on top.
                var order = function(a, b) {
                    return radius(b) - radius(a);
                };

                // Tweens the entire chart by first tweening the year, and then the data.
                // For the interpolated data, the dots and label are redrawn.
                var tweenYear = function() {
                    var year = d3.interpolateNumber(self.yearRange[0], self.yearRange[1]);
                    return function(t) { displayYear(year(t)); };
                };

                // Updates the display to show the specified year.
                var displayYear = function(year) {
                    dot.data(interpolateData(year), key).call(position).sort(order);
                    self.label.text(Math.round(year));
                };

                // Interpolates the dataset for the given (fractional) year.
                var interpolateData = function (year) {
                    return items.map(function(d) {
                        return {
                            name: d.name,
                            region: d.region,
                            chidrenPerWoman: interpolateValues(d.chidrenPerWoman, year),
                            population: interpolateValues(d.population, year),
                            childSurvivalRate: interpolateValues(d.childSurvivalRate, year)
                        };
                    });
                };

                // Finds (and possibly interpolates) the value for the specified year.
                var interpolateValues = function(values, year) {
                    var i = bisect.left(values, year, 0, values.length - 1),
                        a = values[i];
                    if (i > 0) {
                        var b = values[i - 1],
                            t = (year - a[0]) / (b[0] - a[0]);
                        return a[1] * (1 - t) + b[1] * t;
                    }
                    return a[1];
                }

                // A bisector since many nation's data is sparsely-defined.
                var bisect = d3.bisector(function(d) { return d[0]; });

                // Add a dot per nation. Initialize the data at begining year, and set the colors.
                var dot = self.svg.append("g")
                    .attr("class", "dots")
                .selectAll(".dot")
                    .data(interpolateData(self.yearRange[0]))
                .enter().append("circle")
                    .attr("class", "dot")
                    .style("fill", function(d) { return config.colorScale(color(d)); })
                    .call(position)
                    .sort(order);

                // Add a title.
                dot.append("title")
                    .text(function(d) { return d.name; });

                self.startTransition = function() {
                    this.svg.transition()
                    .duration(15000)
                    .ease("linear")
                    .tween("year", tweenYear);
                };

                self.stopTransition = function() {
                    this.svg.transition().duration(0);
                };
            };
            computeData(this.collection.toJSON());
        },
        
        playStop: function(e) {
            if (e.currentTarget.innerHTML === "Play") {
                // Start a transition that interpolates the data based on year.
                if (this.startTransition) this.startTransition();
                e.currentTarget.innerHTML = "Stop";
            }
            else {
                // Cancel the current transition, if any.
                if (this.stopTransition) this.stopTransition();
                e.currentTarget.innerHTML = "Play";
            }
        },

        displayInfo: function(e) {
            var selectedData = this.collection.where({"name":e.currentTarget.firstChild.textContent})[0];
            this.$('.info').html(this.infoTemplate(selectedData.toJSON()));
        }
    });
    return D3AnimView;
});
