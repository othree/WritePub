(function () {

    function WritePub () {
        if (WritePub.singletion) return WritePub.singletion;
        else return WritePub.singletion = this;
    }

    var writepub = window.writepub = new WritePub();
 
    WritePub.prototype.init = function () {
    };

    writepub.init();

})();
