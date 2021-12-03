// Assoc AND atypism
function Assoc(filter1, filter2) {
    this.dataUrl = "/assoc";
    this.pageClass = ".assoc";

    this.filterClass1 = ".assoc_f1";
    this.filterClass2 = ".assoc_f2";

    this.filter1Empty = true;
    this.filter2Empty = true;

    this.$refresh = $(".refresh", this.pageClass);
    this.$list = $(".assoc_list");

    this.filter1 = filter1;
    this.filter2 = filter2;

    this.init();
};

Assoc.ROW = `
<div class="row flex">
    <div class="cell flex result_filter1">
    </div>
    <div class="cell flex result_filter2">
    </div>
    <div class="cell flex-column result_assoc">
        <div class="result_bar"></div>
        <div class="result_value"></div>
        <div class="result_fuzzy"></div>
    </div>
</div>
`;

Assoc.prototype = {
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



    getFuzzy: function(value, type) {
        if (value < 0.01) {
            return "Zero " + type + "/ Insufficient data";
        } else if (value < 0.25) {
            return "Low " + type + "";
        } else if (value < 0.70) {
            return "Moderate " + type + "";
        } else {
            return "High " + type + "";
        }
    },

    getColor: function(value) {
        value = Math.floor(value * 255 * 2);

        if (value < 255) {
            const green = value < 16 ? ("0" + (value).toString(16)) : (value).toString(16);
            return "#ff" + green + "0030";
        } else {
            value = 255 * 2 - value;
            const red = value < 16 ? ("0" + (value).toString(16)) : (value).toString(16);
            return "#" + red + "ff0030";
        }
    },

    getData: function() {
        const filters1 = this.filter1.getFilter();
        const filters2 = this.filter2.getFilter();
        const params = this.filter1.getParams({
            ...filters1,
            filter2: filters2.filter,
            subFilter2: filters2.subFilter,
        });
        $.ajax({
            url: this.dataUrl+params,
            success: (res) => {
                const data = res.data;
                const data2 = res.data2;
                if (res.error) {
                    alert(res.error);
                    return;
                } else {
                    let $html = $(Assoc.ROW);
                    $(".result_filter1", $html).html(filters1.filter + "." + filters1.subFilter + " : " + filters1.value);
                    $(".result_filter2", $html).html(filters2.filter + "." + filters2.subFilter);
                    $(".result_value", $html).html(data);
                    $(".result_fuzzy", $html).html(this.getFuzzy(data, "correlation"));
                    $html.css({
                        background : this.getColor(data),
                        marginBottom: "30px",
                    });
                    this.$list.prepend($html);

                    $html = $(Assoc.ROW);
                    $(".result_filter1", $html).html(filters1.filter + "." + filters1.subFilter + " : " + filters1.value);
                    $(".result_filter2", $html).html(filters2.filter + "." + filters2.subFilter);
                    $(".result_value", $html).html(data2);
                    $(".result_fuzzy", $html).html(this.getFuzzy(data2, "atypism"));
                    $html.css("background", this.getColor(data2));
                    this.$list.prepend($html);
                }
            }
        });
    },
};