function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

module("IHazFlat");

test("creates function for template", function() {
	expect(1);
	ok(ihf.test1 != null, "test1 template exists");
});

test("renders non-parameterized templates", function() {
	expect(3);
	equal(ihf.test1({}, true), "<p>This is a test of the emergency broadcast system.</p>"); // raw text
	var nodes = ihf.test1({});
	equal(typeof nodes, "object"); 
	equal(nodes.text(), "This is a test of the emergency broadcast system."); 
});

test("renders parameterized templates", function() {
	expect(1);
	equal(ihf.test2({prey:'wabbits'}, true), "<span>Be vewwy vewwy quiet, we're hunting wabbits.</span>"); 
});

test("renders ad hoc templates", function() {
	ihf.addTemplate('favoriteColor', 'Red. No, Blue. Aieee!');
	expect(1);
	equal(ihf.favoriteColor({}, true), 'Red. No, Blue. Aieee!');
});

test("clear should wipe 'em out", function () {
    ihf.clear();
    
    ok(isEmptyObject(ihf.templates));
    
    equal(ihf['welcome2'], undefined, "welcome2 template gone?");
});

test("grab that are loaded in later", function () {
    // not recommended use, but should work nonetheless
    $('head').append('<script id="flint" type="text/x-flat">yabba {{ something }} doo!</script>');
    
    ihf.grab();
    equal(ihf.flint({something: 'dabba'}, true), "yabba dabba doo!", "should have new template");
});

test("refresh should empty then grab new", function () {
    // not recommended use, but should work nonetheless
    $('head').append('<script id="mother" type="text/x-flat">your mother was a {{ something }}...</script>');
    
    ihf.clear();
    ihf.grab();
    
    equal(ihf.mother({something: 'hampster'}, true), "your mother was a hampster...", "should have new template");
    equal(ihf.hasOwnProperty('flint'), false, "flint template should be gone");
});


