function Display(filter) {
    this.dataUrl = "/data";
    this.pageClass = ".view";

    this.$refresh = $(".refresh", this.pageClass);
    this.$average = $(".average");

    this.filter = filter;

    this.init();
};

Display.prototype = {

    init: function() {
        this.$refresh.on("click", () => {
            this.getData();
        });
    },

    getData: function () {
        const params = this.filter.getParams(this.filter.getFilter());
        $.ajax({
            url: this.dataUrl + params,
            success: (res) => {
                const data = res.data;
                if (res.error) {
                    alert(res.error);
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
            this.$average.append($canvas);
            const config = {
                type: 'doughnut',
                data: {
                    labels: Object.keys(this.data[i]),
                    datasets: [{
                        label: i,
                        data: Object.values(this.data[i]),
                        borderWidth: 1,
                        backgroundColor: COLOR
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