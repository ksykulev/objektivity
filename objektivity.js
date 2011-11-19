(function( window, undefined ) {

  var objektivity = (function(){
    var DEFAULT_SEP = '&;',
        CLASS_MATCH = new RegExp('\\s(\[a-z|A-Z\]+)');

    var objectClassName = function(object){
      return CLASS_MATCH.exec(Object.prototype.toString.call(object))[1];
    }

    var unescape = function(s){
      if(!s){ return s; }
      return decodeURIComponent(s).replace(/\+/g, ' ');
    }

    var parseQuery = function(queryString, d){
      var params = {},
          matcher = new RegExp("["+(d ? d : DEFAULT_SEP)+"] *"), //default regex /[&;] */
          kvPairs = (queryString || '').split(matcher),
          kvPair,
          k,v;

      for(var i=0, length=kvPairs.length; i < length; i++){
        kvPair = kvPairs[i].split('=',2);
        k = unescape(kvPair[0]);
        v = unescape(kvPair[1]);
        if(cur = params[k]){
          if( objectClassName(params) === "Array" ){
            params[k],push(v);
          } else {
            params[k] = [cur, v]
          }
        } else {
          params[k] = v;
        }
      }

      return params;
    }

    var parseNestedQuery = function(queryString, d){
      var params = {},
          matcher = new RegExp("["+(d ? d : DEFAULT_SEP)+"] *"), //default regex /[&;] */
          kvPairs = (queryString || '').split(matcher),
          kvPair,
          k,v;
      for(var i=0, length=kvPairs.length; i < length; i++){
        kvPair = kvPairs[i].split('=',2);
        k = unescape(kvPair[0]);
        v = unescape(kvPair[1]);
        normalize_params(params, k, v);
      }

      return params;
    }

    var matcherOne    = new RegExp("^[\\[\\]]*([^\\[\\]]+)\\]*(.*)"),
        matcherTwo    = new RegExp("^\\[\\]\\[([^\\[\\]]+)\\]$"),
        matcherThree  = new RegExp("^\\[\\](.+)$");
    var normalize_params = function(params, name, v){
      var kv = matcherOne.exec(name),
          k = (kv && kv[1]) || '',
          after = (kv && kv[2]) || '',
          last;

      if(k.length == 0) {
        return;
      }

      if(after == ""){
        params[k] = v;
      } else if(after == "[]"){
        params[k] || (params[k] = []);

        if(!(objectClassName(params[k]) === "Array")){
          throw "expected Array (got "+objectClassName(params[k])+") for param `"+k+"'";
        }

        params[k].push(v);
      } else if( (child_key = matcherTwo.exec(after)) || (child_key = matcherThree.exec(after)) ){
        child_key = child_key[1];
        params[k] || (params[k] = []);

        if( !(objectClassName(params[k]) === "Array") ){
          throw "expected Array (got "+objectClassName(params[k])+") for param `"+k+"'";
        }

        last = params[k].length-1;
        if( objectClassName(params[k][last]) === "Object" && !(params[k][last][child_key]) ){
          normalize_params(params[k][last], child_key, v);
        } else {
          params[k].push( normalize_params({}, child_key, v) );
        }
      } else {
        params[k] || (params[k] = {});
        if(!(objectClassName(params[k]) === "Object")){
          throw "expected Hash (got "+objectClassName(params[k])+") for param `"+k+"'";
        }

        params[k] = normalize_params(params[k], after, v)
      }
      return params;
    }

    return {
      parseNestedQuery : parseNestedQuery,
      parseQuery: parseQuery,
      unescape : unescape
    }
  })();

  window.objektivity = objektivity;
})(window);