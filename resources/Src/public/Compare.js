function Compare(filter1, filter2) {
    this.dataUrl = "/data";
    this.pageClass = ".compare";

    this.filter1 = filter1;
    this.filter2 = filter2;

    this.$compareAverage = $(".compare_average");
    this.$refresh = $(".refresh", this.pageClass);

    this.filter1Empty = true;
    this.filter2Empty = true;

    this.init();
};

Compare.prototype = {
    init: function() {
        this.filter1.filterCallback = (e) => {
            this.filter1Empty = $(e.target).val() === "";
            this.updateRefreshButton();
        }
        this.filter2.filterCallback = (e) => {
            this.filter2Empty = $(e.target).val() === "";
            this.updateRefreshButton();
        }
        this.$refresh.hide().on("click", () => {
            this.getData();
        });
    },

    updateRefreshButton: function() {
        if (this.filter1Empty || this.filter2Empty) {
            this.$refresh.hide();
        } else {
            this.$refresh.show();
        }
    },

    getData: function() {
        const params1 = this.filter1.getParams(this.filter1.getFilter());
        const params2 = this.filter2.getParams(this.filter2.getFilter());

        $.ajax({
            url: this.dataUrl + params1,
            success: (res1) => {
                const data1 = res1.data;
                if (res1.error) {
                    alert(res1.error);
                    return;
                }
                $.ajax({
                    url: this.dataUrl + params2,
                    success: (res2) => {
                        const data2 = res2.data;
                        if (res2.error) {
                            alert(res2.error);
                            return;
                        } else {
                            this.data1 = {}
                            Object.keys(this.filter1.data).map(key => {
                                this.data1[key] = {};
                                this.filter1.data[key].map(subKey => {
                                    this.data1[key][subKey] = data1[key + "." + subKey];
                                });
                            });

                            this.data2 = {}
                            Object.keys(this.filter2.data).map(key => {
                                this.data2[key] = {};
                                this.filter2.data[key].map(subKey => {
                                    this.data2[key][subKey] = data2[key + "." + subKey];
                                });
                            });
                            this.display();
                        }
                    }
                });
            }
        });
    },

    display: function() {

        this.$compareAverage.html("");
        for (let i in this.data1) {
            const $canvas = $("<canvas width='600' height='600'></canvas>");
            this.$compareAverage.append($canvas);
            const config = {
                type: 'radar',
                data: {
                    labels: Object.keys(this.data1[i]),
                    datasets: [{
                        label: i,
                        data: Object.values(this.data1[i]),
                        borderWidth: 1,
                        backgroundColor: COLOR[0] + "70"
                    },{
                        label: i,
                        data: Object.values(this.data2[i]),
                        borderWidth: 1,
                        backgroundColor: COLOR[COLOR.length - 1] + "70"
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