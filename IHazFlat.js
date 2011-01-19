/*
IHazFlat.js version 0.1 -- by @HenrikJoreteg
Flatstache.js -- by @natevw
More info at: http://github.com/andyet/IHazFlat.js
*/
(function ($) {
/*
 flatstache.js - Logic-less, section-less templates in JavaScript. Expands simple (flat) Mustache templates.
 (c) 2011 Nathan Vander Wilt. MIT license.
*/

var Flatstache = {
    _re3: new RegExp("{{{\\s*(\\w+)\\s*}}}", 'g'),
    _re2: new RegExp("{{\\s*(\\w+)\\s*}}", 'g'),
    _re1: new RegExp("&(?!\\w+;)|[\"'<>\\\\]", "g"),
    _escapeHTML: function(s) {
        return s.replace(Flatstache._re1, function(c) {
             switch(c) {
                 case "&": return "&amp;";
                 case "\\": return "&#92;";
                 case "\"": return "&quot;";
                 case "'": return "&#39;";
                 case "<": return "&lt;";
                 case ">": return "&gt;";
                 default: return c;
             }
         });
    }
};
Flatstache.to_html = function (template, data) {
    return template
        .replace(Flatstache._re3, function (m, key) { return data[key] || ""; })
        .replace(Flatstache._re2, function (m, key) { return Flatstache._escapeHTML(data[key] || ""); });
};/*!
  IHazFlat.js -- by @HenrikJoreteg
*/
/*global jQuery  */
function IHazFlat() {
    var self = this;
    self.VERSION = "0.1";
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
})(window.jQuery || window.Zepto);
