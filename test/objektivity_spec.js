describe("objektivity_spec", function(){
  describe('unescape', function(){
    it("should unescape angle brackets", function(){
      expect(objektivity.unescape('fo%3Co%3Ebar')).toEqual('fo<o>bar');
    });
    it("should unespace +", function(){
      expect(objektivity.unescape('a+space')).toEqual('a space');
    });
    it("should unespace %20", function(){
      expect(objektivity.unescape('a%20space')).toEqual('a space');
    });
    it("should unespace a URI escaped string", function(){
      expect(objektivity.unescape('q1%212%22%27w%245%267%2Fz8%29%3F%5C')).toEqual("q1!2\"'w$5&7/z8)?\\");
    });
    it("should not unescape undefined", function(){
      expect(objektivity.unescape(undefined)).toEqual(undefined);
    });
    it("should not unescape null", function(){
      expect(objektivity.unescape(null)).toEqual(null);
    });
    it("should unescape empty string", function(){
      expect(objektivity.unescape('')).toEqual('');
    });
  }); //7

  describe('parseQuery', function(){
    it("should parse a simple query string", function(){
      expect(objektivity.parseQuery('foo=bar')).toEqual({"foo": "bar"});
    });
    it("should parse query strings with quotes", function(){
      expect(objektivity.parseQuery("foo=\"bar\"")).toEqual({"foo": "\"bar\""});
    });
    it("should parse multiple parameters values", function(){
      expect(objektivity.parseQuery('foo=bar&foo=quux')).toEqual({"foo": ['bar', 'quux']});
    });
    it("should parse multiple key value pairs", function(){
      expect(objektivity.parseQuery('foo=1&bar=2')).toEqual({"foo": '1', "bar": '2'});
    });
    it("should unescape a URI escaped string", function(){
      expect(objektivity.parseQuery('my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F')).toEqual({"my weird field": "q1!2\"'w$5&7/z8)?"});
    });
    it("should unescape equals signs", function(){
      expect(objektivity.parseQuery("foo%3Dbaz=bar")).toEqual({"foo=baz": "bar"});
    });
  }); //6
//13
  describe('parseNestedQuery', function(){
    describe('non-nested simple objects', function(){
      it("should handle a query string", function(){
        expect(objektivity.parseNestedQuery("foo")).toEqual({"foo": undefined});
      });
      it("should handle a query with empty value", function(){
        expect(objektivity.parseNestedQuery("foo=")).toEqual({"foo": ""});
      });
      it("should handle a query with a value", function(){
        expect(objektivity.parseNestedQuery("foo=bar")).toEqual({"foo": "bar"});
      });
      it("should handle a query with a quoted value", function(){
        expect(objektivity.parseNestedQuery("foo=\"bar\"")).toEqual({"foo": "\"bar\""});
      });

      it("should handle a query with a redefined value, and use the last definition", function(){
        expect(objektivity.parseNestedQuery("foo=bar&foo=quux")).toEqual({"foo": "quux"});
      });
      it("should handle a query with a redefined empty, and use the last definition", function(){
        expect(objektivity.parseNestedQuery("foo&foo=")).toEqual({"foo": ""});
      });

      it("should handle a query with two values", function(){
        expect(objektivity.parseNestedQuery("foo=1&bar=2")).toEqual({"foo": "1", "bar": "2"});
      });
      it("should handle a query with two values with some extra &'s", function(){
        expect(objektivity.parseNestedQuery("&foo=1&&bar=2")).toEqual({"foo": "1", "bar": "2"});
      });
      it("should handle a query with two values where the first value is undefined", function(){
        expect(objektivity.parseNestedQuery("foo&bar=")).toEqual({"foo": undefined, "bar": ""});
      });
      it("should handle a query with two values where the first value is specified", function(){
        expect(objektivity.parseNestedQuery("foo=bar&baz=")).toEqual({"foo": "bar", "baz": ""});
      });
      it("should handle a query with a key and value being URI escaped", function(){
        expect(objektivity.parseNestedQuery("my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F")).toEqual({"my weird field": "q1!2\"'w$5&7/z8)?"});
      });
      it("should handle a key with an escaped '='", function(){
        expect(objektivity.parseNestedQuery("a=b&pid%3D1234=1023")).toEqual({"pid=1234": "1023", "a": "b"});
      });
    });
//25
    describe("non-nested complex objects", function(){
      it("should handle undefined value", function(){
        expect(objektivity.parseNestedQuery("foo[]")).toEqual({"foo": [undefined]});
      });
      it("should handle an empty value", function(){
        expect(objektivity.parseNestedQuery("foo[]=")).toEqual({"foo": [""]});
      });
      it("should handle a value", function(){
        expect(objektivity.parseNestedQuery("foo[]=bar")).toEqual({"foo": ["bar"]});
      });
      it("should handle two values", function(){
        expect(objektivity.parseNestedQuery("foo[]=1&foo[]=2")).toEqual({"foo": ["1","2"]});
      });
      it("should handle one regular value and an array", function(){
        expect(objektivity.parseNestedQuery("foo=bar&baz[]=1&baz[]=2&baz[]=3")).toEqual({"foo": "bar", "baz": ["1","2","3"]});
      });
      it("should handle two arrays", function(){
        expect(objektivity.parseNestedQuery("foo[]=bar&baz[]=1&baz[]=2&baz[]=3")).toEqual({"foo": ["bar"], "baz": ["1","2","3"]});
      });
    });
//31
//In a rush and got lazy... going to name these by the query string they are testing
    describe("nested complex objects", function(){
      describe("hashes", function(){
        it("x[y][z]=1", function(){
          expect(objektivity.parseNestedQuery("x[y][z]=1")).toEqual( {"x": {"y": {"z": "1"}}} );
        });
        it("x[y][z][]=1", function(){
          expect(objektivity.parseNestedQuery("x[y][z][]=1")).toEqual( {"x": {"y": {"z": ["1"]}}} );
        });
        it("x[y][z]=1&x[y][z]=2", function(){
          expect(objektivity.parseNestedQuery("x[y][z]=1&x[y][z]=2")).toEqual( {"x": {"y": {"z": "2"}}} );
        });
        it("x[y][z]=1&x[y][z]=2", function(){
          expect(objektivity.parseNestedQuery("x[y][z][]=1&x[y][z][]=2")).toEqual( {"x": {"y": {"z": ["1", "2"]}}} );
        });
        it('x[y][z][+]=11', function(){
          //handling the touchy subject where the array object is defined with a space.
          //example: x[ ] instead of x[]
          expect(objektivity.parseNestedQuery("x[y][z][+]=11")).toEqual( {"x" : {"y": {"z": ["11"]}}} );
        });
      });
//36
      describe("arrays of hashes", function(){
        it("x[y][][z]=1", function(){
          expect(objektivity.parseNestedQuery("x[y][][z]=1")).toEqual( {"x": {"y": [ {"z": "1"} ]}} );
        });
        it("x[y][][z][]=1", function(){
          expect(objektivity.parseNestedQuery("x[y][][z][]=1")).toEqual( {"x": {"y": [ {"z": ["1"]} ]}} );
        });
        it("x[y][][z]=1&x[y][][w]=2", function(){
          expect(objektivity.parseNestedQuery("x[y][][z]=1&x[y][][w]=2")).toEqual( {"x": {"y": [ {"z": "1", "w": "2"} ]}} );
        });
        it("x[y][][v][w]=1", function(){
          expect(objektivity.parseNestedQuery("x[y][][v][w]=1")).toEqual( {"x": {"y": [ {"v": {"w" : "1"}} ]}} );
        });
        it("x[y][][z]=1&x[y][][v][w]=2", function(){
          expect(objektivity.parseNestedQuery("x[y][][z]=1&x[y][][v][w]=2")).toEqual( {"x": {"y": [ {"z": "1", "v": {"w" : "2"}} ]}} );
        });

        it("x[y][][z]=1&x[y][][z]=2", function(){
          expect(objektivity.parseNestedQuery("x[y][][z]=1&x[y][][z]=2")).toEqual( {"x": {"y": [ {"z": "1"}, {"z" : "2"} ]}} );
        });
        it("x[y][][z]=1&x[y][][w]=a&x[y][][z]=2&x[y][][w]=3", function(){
          expect(objektivity.parseNestedQuery("x[y][][z]=1&x[y][][w]=a&x[y][][z]=2&x[y][][w]=3")).
            toEqual( {"x": {"y": [ {"z": "1", "w": "a"}, {"z": "2", "w": "3"}  ]}} );
        });
      });
//43
    });
    describe("errors", function(){
      it("x[y]=1&x[y]z=2", function(){
        expect( function(){return objektivity.parseNestedQuery("x[y]=1&x[y]z=2");} ).toThrow("expected Hash (got String) for param `y'");
      });
      it("x[y]=1&x[]=1", function(){
        expect( function(){return objektivity.parseNestedQuery("x[y]=1&x[]=1");} ).toThrow("expected Array (got Object) for param `x'");
      });
      it("x[y]=1&x[y][][w]=2", function(){
        expect( function(){return objektivity.parseNestedQuery("x[y]=1&x[y][][w]=2");} ).toThrow("expected Array (got String) for param `y'");
      });
    });
//46
  });
});