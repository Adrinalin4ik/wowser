'use strict';

var tessy = function initTesselator() {
    // function called for each vertex of tesselator output
    function vertexCallback(data, polyVertArray) {
        // console.log(data[0], data[1]);
        polyVertArray[polyVertArray.length] = data[0];
        polyVertArray[polyVertArray.length] = data[1];
    }
    function begincallback(type) {
        if (type !== libtess.primitiveType.GL_TRIANGLES) {
            console.log('expected TRIANGLES but got type: ' + type);
        }
    }
    function errorcallback(errno) {
        console.log('error callback');
        console.log('error number: ' + errno);
    }
    // callback for when segments intersect and must be split
    function combinecallback(coords, data, weight) {
        // console.log('combine callback');
        return [coords[0], coords[1], coords[2]];
    }
    function edgeCallback(flag) {
        // don't really care about the flag, but need no-strip/no-fan behavior
        // console.log('edge flag: ' + flag);
    }

    var tessy = new libtess.GluTesselator();
    // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

    return tessy;
}();