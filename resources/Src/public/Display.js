function Display(filter) {
    this.dataUrl = "/data";

    this.$refresh = $(".refresh");
    this.$average = $(".average");

    this.colors = [];

    this.filter = filter;

    this.init();
};

Display.prototype = {

    init: function() {
        this.$refresh.on("click", () => {
            this.getData();
        })
    },

    getData: function () {
        const filters = this.filter.getFilter();
        const params = filters ? ("?" + Object.entries(filters).map(key_value =>
            key_value[0] + "=" + key_value[1]).join("&")
        ) : "";
        $.ajax({
            url: this.dataUrl+params,
            success: (res) => {
                const data = res.data;
                if (res.error) {
                    alert("No flight for the selected filter");
                    return;
                } else {
                    this.data = {}
                    Object.keys(this.filter.data).map(key => {
                        this.data[key] = {};
                        this.filter.data[key].map(subKey => {
                            this.data[key][subKey] = data[key + "." + subKey];
                        });
                    });
                    this.display();
                }
            }
        });
    },

    display: function() {
        this.$average.html("");
        for (let i in this.data) {
            const $canvas = $("<canvas width='400' height='400'></canvas>");
            $(".average").append($canvas);
            const config = {
                type: 'doughnut',
                data: {
                    labels: Object.keys(this.data[i]),
                    datasets: [{
                        label: i,
                        data: Object.values(this.data[i]),
                        borderWidth: 1,
                        backgroundColor: ("#00876c\n" +
                            "#71ae80\n" +
                            "#bad59e\n" +
                            "#fffcc8\n" +
                            "#f2c484\n" +
                            "#e7865a\n" +
                            "#d43d51").split("\n")
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: i
                        },
                        colorschemes: {
                            scheme: 'brewer.Paired12'
                        }
                    }
                }
            };
            const myChart = new Chart($canvas, config);
        }
    }
};