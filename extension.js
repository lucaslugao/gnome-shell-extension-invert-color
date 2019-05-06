/*
  The MIT License (MIT)

  Copyright (c) 2016 Mai Lavelle

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

const Main = imports.ui.main;
const Lang = imports.lang;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;

const Self = ExtensionUtils.getCurrentExtension();
const Convenience = Self.imports.convenience;
const Shader = Self.imports.shader;

const SHORTCUT = "invert-window-preserving-hue-shortcut";

const InvertWindowEffect = new Lang.Class({
  Name: "InvertWindowEffect",
  Extends: Clutter.ShaderEffect,

  _init: function(params) {
    this.parent(params);
    this.set_shader_source(Shader.getSource());
  },

  vfunc_paint_target: function() {
    this.set_uniform_value("tex", 0);
    this.parent();
  }
});

function InvertWindow() {
  this.settings = Convenience.getSettings();
}

InvertWindow.prototype = {
  toggle_effect: function() {
    global.get_window_actors().forEach(function(actor) {
      let meta_window = actor.get_meta_window();
      if (meta_window.has_focus()) {
        if (actor.get_effect("invert-color")) {
          actor.remove_effect_by_name("invert-color");
          delete meta_window._invert_window_tag;
        } else {
          let effect = new InvertWindowEffect();
          actor.add_effect_with_name("invert-color", effect);
          meta_window._invert_window_tag = true;
        }
      }
    }, this);
  },

  enable: function() {
    Main.wm.addKeybinding(
      SHORTCUT,
      this.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.NORMAL,
      Lang.bind(this, this.toggle_effect)
    );

    global.get_window_actors().forEach(function(actor) {
      let meta_window = actor.get_meta_window();
      if (meta_window.hasOwnProperty("_invert_window_tag")) {
        let effect = new InvertWindowEffect();
        actor.add_effect_with_name("invert-color", effect);
      }
    }, this);
  },

  disable: function() {
    Main.wm.removeKeybinding(SHORTCUT);

    global.get_window_actors().forEach(function(actor) {
      actor.remove_effect_by_name("invert-color");
    }, this);
  }
};

let invert_window;

function init() {}

function enable() {
  invert_window = new InvertWindow();
  invert_window.enable();
}

function disable() {
  invert_window.disable();
  invert_window = null;
}
