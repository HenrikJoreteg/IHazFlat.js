/*!
  IHazFlat.js -- by @HenrikJoreteg
*/
/*global jQuery  */
function IHazFlat() {
    var self = this;
    self.VERSION = "@VERSION@";
    self.templates = {};
    
    // public function for adding templates
    // We're enforcing uniqueness to avoid accidental template overwrites.
    // If you want a different template, it should have a different name.
    self.addTemplate = function (name, templateString) {
        if (self[name]) throw "Invalid name: " + name + ".";
        if (self.templates[name]) throw "Template \" + name + \" exists";
        
        self.templates[name] = templateString;
        self[name] = function (data, raw) {
            data = data || {};
            var result = Flatstache.to_html(self.templates[name], data);
            return raw ? result : $(result);
        };
    };
    
    // grabs templates from the DOM and caches them.
    // Loop through and add templates.
    // Whitespace at beginning and end of all templates inside <script> tags will 
    // be trimmed.
    self.grab = function () {        
        $('script[type="text/x-flat"]').each(function (a, b) {
            var script = $((typeof a === 'number') ? b : a), // Zepto doesn't bind this
                text = (''.trim) ? script.html().trim() : $.trim(script.html());
            
            self.addTemplate(script.attr('id'), text);
            script.remove();
        });
    };
    
    // clears all retrieval functions and empties caches
    self.clear = function () {
        for (var key in self.templates) {
            delete self[key];
        }
        self.templates = {};
    };
};

window.ihf = new IHazFlat();

// init itself on document ready
$(function () {
    window.ihf.grab();
});
