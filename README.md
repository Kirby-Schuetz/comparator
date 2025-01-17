# comparator
a math tool to compare two sets of blocks

components:
2 stacks that can hold up to 10 blocks each
Blocks can be added/removed one at a time by student or through a control panel input outside of the widget.
Blocks can be added/removed (on a delay for visual interest) or set to num from control panel
Number labels for each stack that can be in input or label mode. 
Switch modes from control panel
Show current value of input/label in control panel
Auto comparator lines that can be shown/hidden from control panel
Student-drawn comparator lines that “snap” to the top or bottom of a stack of blocks
A comparator in between the two stacks that can show <,>, or =

interactions:
Add/remove mode:
Student can click a stack area to add, click-drag to remove
Open to suggestions on these if another gesture would work better

Compare mode:
Student can tap to start a line and tap to end. The in-progress drag shows a line from the starting location to the mouse/finger. This interaction is constrained to the top or bottom of the stack. If they try to start outside one of those zones, discard
If they try to start on one that’s already connected, discard
If they try to end anywhere other than the corresponding location (top->top, bottom->bottom) discard

control panel:
State of widget
Stacks, block count (input to change), label/input value
Interaction Mode: [none/addRemove/drawCompare]
Button to play comparison animation: after the student has drawn the lines from the stacks, those lines animate to the shape of the corresponding comparator in the center

dynamic arrangement of blocks:
Stacks should be positioned roughly ⅓ in from each side
The stacks should be centered vertically in the widget space
Spacing between the blocks should be the same between both stacks.
