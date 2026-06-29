"use client";

import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';

interface BlockEditorProps {
  initialXml?: string;
  onCodeChange?: (code: string, xml: string) => void;
  height?: number;

}


// Custom toolbox XML for Learnverse add-on builder (micro:bit style)
const LEARNVERSE_TOOLBOX = `
<xml>
  <category name="🎨 Pages" colour="#4C97FF">
    <block type="make_page"></block>
    <block type="go_to_page"></block>
    <block type="set_page_color"></block>
    <block type="add_background_image"></block>
  </category>
  
  <category name="🔘 Buttons & Input" colour="#FFAB19">
    <block type="add_button"></block>
    <block type="on_button_click"></block>
    <block type="add_text_input"></block>
    <block type="get_input_value"></block>
    <block type="add_slider"></block>
  </category>
  
  <category name="⚡ Actions" colour="#FF6680">
    <block type="show_message"></block>
    <block type="add_points"></block>
    <block type="play_sound"></block>
    <block type="show_popup"></block>
    <block type="vibrate_device"></block>
    <block type="change_theme"></block>
  </category>
  
  <category name="🧠 Logic" colour="#5C81A6">
    <block type="controls_if"></block>
    <block type="controls_ifelse"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>
  
  <category name="🔁 Loops" colour="#5CA65C">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for"></block>
    <block type="controls_forEach"></block>
    <block type="controls_flow_statements"></block>
  </category>
  
  <category name="🔢 Math" colour="#5C68A6">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
    <block type="math_trig"></block>
    <block type="math_constant"></block>
    <block type="math_number_property"></block>
    <block type="math_round"></block>
    <block type="math_modulo"></block>
    <block type="math_constrain"></block>
    <block type="math_random_int"></block>
    <block type="math_random_float"></block>
  </category>
  
  <category name="📝 Text" colour="#5CA68D">
    <block type="text"></block>
    <block type="text_join"></block>
    <block type="text_append"></block>
    <block type="text_length"></block>
    <block type="text_isEmpty"></block>
    <block type="text_indexOf"></block>
    <block type="text_charAt"></block>
    <block type="text_print"></block>
  </category>
  
  <category name="📋 Lists" colour="#745CA6">
    <block type="lists_create_empty"></block>
    <block type="lists_create_with"></block>
    <block type="lists_repeat"></block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf"></block>
    <block type="lists_getIndex"></block>
    <block type="lists_setIndex"></block>
  </category>
  
  <category name="🎮 Game" colour="#A6745C">
    <block type="create_character"></block>
    <block type="move_character"></block>
    <block type="check_collision"></block>
    <block type="add_score"></block>
    <block type="game_over"></block>
    <block type="start_timer"></block>
  </category>
  
  <category name="🎨 Graphics" colour="#A65C81">
    <block type="draw_shape"></block>
    <block type="set_color"></block>
    <block type="add_sprite"></block>
    <block type="animate_object"></block>
    <block type="add_effect"></block>
  </category>
  
  <category name="📦 Variables" colour="#A65C99" custom="VARIABLE"></category>
  <category name="⚙️ Functions" colour="#995CA6" custom="PROCEDURE"></category>
</xml>
`;

// Define custom blocks for Learnverse add-ons
if (typeof window !== 'undefined' && Blockly.Blocks) {
  // Pages category
  Blockly.Blocks['make_page'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("make page")
          .appendField(new Blockly.FieldTextInput("page1"), "PAGE_NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4C97FF');
      this.setTooltip("🎉 Create a new page for your add-on! Like a new room!");
    }
  };

  Blockly.Blocks['go_to_page'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("go to page")
          .appendField(new Blockly.FieldTextInput("page1"), "PAGE_NAME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4C97FF');
      this.setTooltip("🚀 Jump to a different page! Like opening a door!");
    }
  };

  Blockly.Blocks['set_page_color'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set page color to")
          .appendField(new Blockly.FieldDropdown([
            ["red", "#ff0000"],
            ["blue", "#0000ff"],
            ["green", "#00ff00"],
            ["yellow", "#ffff00"],
            ["purple", "#ff00ff"],
            ["orange", "#ff8800"]
          ]), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4C97FF');
      this.setTooltip("Change the page background color");
    }
  };

  Blockly.Blocks['add_background_image'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set background image")
          .appendField(new Blockly.FieldTextInput("image.png"), "IMAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#4C97FF');
      this.setTooltip("Add a background image to the page");
    }
  };

  // Buttons & Input category
  Blockly.Blocks['add_button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add button")
          .appendField(new Blockly.FieldTextInput("Click me!"), "BUTTON_TEXT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
      this.setTooltip("👆 Add a button that people can click! So cool!");
    }
  };

  Blockly.Blocks['on_button_click'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("when button")
          .appendField(new Blockly.FieldTextInput("button1"), "BUTTON_ID")
          .appendField("clicked");
      this.appendStatementInput("DO")
          .appendField("do");
      this.setColour('#FFAB19');
      this.setTooltip("✨ Run code when someone clicks the button! Magic!");
    }
  };

  Blockly.Blocks['add_text_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add text input")
          .appendField(new Blockly.FieldTextInput("input1"), "INPUT_ID");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
      this.setTooltip("Add a text input field");
    }
  };

  Blockly.Blocks['get_input_value'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("get value from")
          .appendField(new Blockly.FieldTextInput("input1"), "INPUT_ID");
      this.setOutput(true, "String");
      this.setColour('#FFAB19');
      this.setTooltip("Get the value from an input field");
    }
  };

  Blockly.Blocks['add_slider'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add slider from")
          .appendField(new Blockly.FieldNumber(0), "MIN")
          .appendField("to")
          .appendField(new Blockly.FieldNumber(100), "MAX");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FFAB19');
      this.setTooltip("Add a slider control");
    }
  };

  // Actions category
  Blockly.Blocks['show_message'] = {
    init: function() {
      this.appendValueInput("MESSAGE")
          .appendField("show message");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("💬 Show a message to the player! Say hi!");
    }
  };

  Blockly.Blocks['add_points'] = {
    init: function() {
      this.appendValueInput("POINTS")
          .setCheck("Number")
          .appendField("add points");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("🎉 Give points to the player! They'll love it!");
    }
  };

  Blockly.Blocks['play_sound'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("play sound")
          .appendField(new Blockly.FieldDropdown([
            ["beep", "BEEP"],
            ["boop", "BOOP"],
            ["ding", "DING"],
            ["whoosh", "WHOOSH"]
          ]), "SOUND");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("🔊 Play a cool sound! Beep boop!");
    }
  };

  Blockly.Blocks['show_popup'] = {
    init: function() {
      this.appendValueInput("TEXT")
          .appendField("show popup");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("Show a popup message");
    }
  };

  Blockly.Blocks['vibrate_device'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("vibrate for")
          .appendField(new Blockly.FieldNumber(100), "DURATION")
          .appendField("ms");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("Vibrate the device");
    }
  };

  Blockly.Blocks['change_theme'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("change theme to")
          .appendField(new Blockly.FieldDropdown([
            ["light", "LIGHT"],
            ["dark", "DARK"],
            ["ocean", "OCEAN"],
            ["space", "SPACE"]
          ]), "THEME");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FF6680');
      this.setTooltip("Change the app theme");
    }
  };

  // Game category
  Blockly.Blocks['create_character'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create character")
          .appendField(new Blockly.FieldTextInput("player"), "NAME")
          .appendField("at x:")
          .appendField(new Blockly.FieldNumber(0), "X")
          .appendField("y:")
          .appendField(new Blockly.FieldNumber(0), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A6745C');
      this.setTooltip("🦸 Make a character in your game! Name them anything!");
    }
  };

  Blockly.Blocks['move_character'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("move")
          .appendField(new Blockly.FieldTextInput("player"), "NAME")
          .appendField(new Blockly.FieldDropdown([
            ["up", "UP"],
            ["down", "DOWN"],
            ["left", "LEFT"],
            ["right", "RIGHT"]
          ]), "DIRECTION");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A6745C');
      this.setTooltip("🏃 Make your character move! Up, down, left, or right!");
    }
  };

  Blockly.Blocks['check_collision'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("is")
          .appendField(new Blockly.FieldTextInput("player"), "OBJ1")
          .appendField("touching")
          .appendField(new Blockly.FieldTextInput("enemy"), "OBJ2");
      this.setOutput(true, "Boolean");
      this.setColour('#A6745C');
      this.setTooltip("Check if two objects are colliding");
    }
  };

  Blockly.Blocks['add_score'] = {
    init: function() {
      this.appendValueInput("AMOUNT")
          .setCheck("Number")
          .appendField("add to score");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A6745C');
      this.setTooltip("Increase the game score");
    }
  };

  Blockly.Blocks['game_over'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("game over");
      this.setPreviousStatement(true, null);
      this.setColour('#A6745C');
      this.setTooltip("End the game");
    }
  };

  Blockly.Blocks['start_timer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("start timer for")
          .appendField(new Blockly.FieldNumber(60), "SECONDS")
          .appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A6745C');
      this.setTooltip("Start a countdown timer");
    }
  };

  // Graphics category
  Blockly.Blocks['draw_shape'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("draw")
          .appendField(new Blockly.FieldDropdown([
            ["circle", "CIRCLE"],
            ["square", "SQUARE"],
            ["triangle", "TRIANGLE"],
            ["star", "STAR"]
          ]), "SHAPE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A65C81');
      this.setTooltip("🔵 Draw a shape on the screen! Circles, stars, and more!");
    }
  };

  Blockly.Blocks['set_color'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set color to")
          .appendField(new Blockly.FieldDropdown([
            ["red", "#ff0000"],
            ["blue", "#0000ff"],
            ["green", "#00ff00"],
            ["yellow", "#ffff00"],
            ["purple", "#ff00ff"],
            ["orange", "#ff8800"],
            ["pink", "#ff69b4"],
            ["black", "#000000"],
            ["white", "#ffffff"]
          ]), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A65C81');
      this.setTooltip("Change the drawing color");
    }
  };

  Blockly.Blocks['add_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add sprite")
          .appendField(new Blockly.FieldTextInput("sprite.png"), "IMAGE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A65C81');
      this.setTooltip("Add an image sprite");
    }
  };

  Blockly.Blocks['animate_object'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("animate")
          .appendField(new Blockly.FieldTextInput("object"), "OBJECT")
          .appendField(new Blockly.FieldDropdown([
            ["fade in", "FADE_IN"],
            ["fade out", "FADE_OUT"],
            ["bounce", "BOUNCE"],
            ["spin", "SPIN"]
          ]), "ANIMATION");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A65C81');
      this.setTooltip("Animate an object");
    }
  };

  Blockly.Blocks['add_effect'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add effect")
          .appendField(new Blockly.FieldDropdown([
            ["sparkles", "SPARKLES"],
            ["confetti", "CONFETTI"],
            ["particles", "PARTICLES"],
            ["glow", "GLOW"]
          ]), "EFFECT");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#A65C81');
      this.setTooltip("Add a visual effect");
    }
  };
}

export default function BlockEditor({ initialXml = '', onCodeChange, height = 480 }: BlockEditorProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;
    
    // Capture ref value for cleanup
    const divElement = blocklyDiv.current;
    
    // Inject Blockly workspace
    workspaceRef.current = Blockly.inject(divElement, {
      toolbox: LEARNVERSE_TOOLBOX,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true,
      sounds: true,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ddd',
        snap: true
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      renderer: 'zelos'  // Modern rounded blocks like Scratch!
    });
    
    // Enable all context menu options
    if (workspaceRef.current) {
      workspaceRef.current.options.readOnly = false;
    }
    
    // 👆 DOUBLE-TAP SUPPORT! 👆
    let lastTouchTime = 0;
    const doubleTapDelay = 300; // milliseconds between taps
    
    const handleDoubleTap = (e: TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTouchTime;
      
      if (tapLength < doubleTapDelay && tapLength > 0) {
        // Double tap detected! Simulate right-click
        e.preventDefault();
        
        // Create and dispatch a context menu event
        const touch = e.changedTouches[0];
        const contextMenuEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: touch.clientX,
          clientY: touch.clientY,
          button: 2
        });
        
        e.target?.dispatchEvent(contextMenuEvent);
      }
      
      lastTouchTime = currentTime;
    };
    
    divElement.addEventListener('touchend', handleDoubleTap, { passive: false });
    
    // ...existing code for loading XML, event listeners, etc...
    return () => {
      divElement.removeEventListener('touchend', handleDoubleTap);
      workspaceRef.current?.dispose();
    };
  }, [initialXml, onCodeChange]);

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes rainbow-border {
          0% { border-color: #FFD700; }
          16% { border-color: #FF6B9D; }
          33% { border-color: #C084FC; }
          50% { border-color: #60A5FA; }
          66% { border-color: #34D399; }
          83% { border-color: #FBBF24; }
          100% { border-color: #FFD700; }
        }
        .rainbow-border-animate {
          animation: rainbow-border 5s linear infinite;
        }
      `}</style>
      
      {/* Super Fun Animated Header */}
      <div className="mb-4 p-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-t-xl text-white shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl animate-bounce">🧩</span>
            <h3 className="font-black text-3xl drop-shadow-lg">Block Builder Zone!</h3>
            <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
          </div>
          <p className="text-lg font-bold mb-2">🎨 Drag colorful blocks to create amazing things! 🚀</p>
          <div className="flex justify-center gap-6 text-sm mt-3">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="font-bold">👆 Drag blocks</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="font-bold">🖱️ Two-finger tap OR Control+Click</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="font-bold">🗑️ Trash to delete</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blockly workspace with super colorful border and fun design */}
      <div className="relative">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-400 px-6 py-2 rounded-full z-10 shadow-lg">
          <p className="text-white font-bold text-sm">👇 Your Building Space! 👇</p>
        </div>
        <div
          ref={blocklyDiv}
          className="border-8 border-double rounded-xl shadow-2xl rainbow-border-animate"
          style={{ 
            width: '100%', 
            height: height, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        ></div>
      </div>
      
      {/* Fun Encouraging Footer */}
      <div className="mt-4 space-y-3">
        <div className="p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl border-4 border-yellow-400 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌟</span>
            <div>
              <p className="text-lg font-bold text-gray-800">You&apos;re doing awesome!</p>
              <p className="text-sm text-gray-700">11 categories • Tons of blocks • Unlimited creativity!</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
            <div className="text-2xl mb-1">🎮</div>
            <p className="text-xs font-bold text-gray-700">Game blocks = Make characters & scores!</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg border-2 border-purple-300">
            <div className="text-2xl mb-1">🎨</div>
            <p className="text-xs font-bold text-gray-700">Graphics blocks = Draw & animate!</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg border-2 border-green-300">
            <div className="text-2xl mb-1">🔢</div>
            <p className="text-xs font-bold text-gray-700">Math blocks = Count & calculate!</p>
          </div>
          <div className="p-3 bg-pink-100 rounded-lg border-2 border-pink-300">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-bold text-gray-700">Action blocks = Show messages & sounds!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
