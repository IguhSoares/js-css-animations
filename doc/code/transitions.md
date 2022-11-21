---
title: transitions
---

# transitions

<a name="module_transitions"></a>

## transitions
Handle user defined transitions to not conflict with js-css-animations transitions


* [transitions](#module_transitions)
    * _static_
        * [.getCurrentTransition](#module_transitions.getCurrentTransition) ⇒ <code>string</code> \| <code>null</code>
        * [.getClassTransition](#module_transitions.getClassTransition) ⇒ <code>string</code>
        * [.appendTransition](#module_transitions.appendTransition)
        * [.setDimensionsTransitions](#module_transitions.setDimensionsTransitions)
        * [.removeInlineTransition](#module_transitions.removeInlineTransition)
        * [.removeDimensionsTransitions](#module_transitions.removeDimensionsTransitions)
    * _inner_
        * [~getAllTransitions(cssProperties)](#module_transitions..getAllTransitions) ⇒ <code>string</code>
            * [~transitions](#module_transitions..getAllTransitions..transitions) : <code>Object</code>
            * [~properties](#module_transitions..getAllTransitions..properties) : <code>Array.&lt;string&gt;</code>
        * [~getTransitionClassName(wTransit, hTransit)](#module_transitions..getTransitionClassName) ⇒ <code>string</code> \| <code>undefined</code>

<a name="module_transitions.getCurrentTransition"></a>

### transitions.getCurrentTransition ⇒ <code>string</code> \| <code>null</code>
Gets user defined transitions of an element, if any

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  
**Returns**: <code>string</code> \| <code>null</code> - All user defined transitions combined into single shorthand

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="module_transitions.getClassTransition"></a>

### transitions.getClassTransition ⇒ <code>string</code>
Gets the transition in a given CSS class

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  
**Returns**: <code>string</code> - A shorthand value for CSS transition property  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>string</code> | Name of the animation's CSS class |

<a name="module_transitions.appendTransition"></a>

### transitions.appendTransition
If an element already has any transition defined, other than that in className,

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The DOM element to append the transition |
| className | <code>string</code> | CSS class with a transition to append to other transitions |
| currTransition | <code>string</code> | Transition(s) already defined to element, before it receives the new class (className) |

<a name="module_transitions.setDimensionsTransitions"></a>

### transitions.setDimensionsTransitions
Appends the appropriate CSS class to handle dimension transitions.

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The DOM element to set the transition |
| wTransit | <code>boolean</code> | Indicates if should have width transition |
| hTransit | <code>boolean</code> | Indicates if should have height transition |

<a name="module_transitions.removeInlineTransition"></a>

### transitions.removeInlineTransition
If element has an inline css transition appended by appendTransition()

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  
**See**: module:transitions.appendTransition  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The DOM element to remove the transition |

<a name="module_transitions.removeDimensionsTransitions"></a>

### transitions.removeDimensionsTransitions
Removes the CSS class added by setDimensionsTransitions(), if any

**Kind**: static constant of [<code>transitions</code>](#module_transitions)  
**See**: module:transitions.setDimensionsTransitions  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The DOM element to remove the transitions |
| wTransit | <code>boolean</code> | Indicates wheter there was a width transition |
| hTransit | <code>boolean</code> | Indicates wheter there was a height transition |

<a name="module_transitions..getAllTransitions"></a>

### transitions~getAllTransitions(cssProperties) ⇒ <code>string</code>
Parses all CSS properties and combine all transitions into one valid shorthand value

**Kind**: inner method of [<code>transitions</code>](#module_transitions)  
**Returns**: <code>string</code> - All transitions combined into a single shorthand property  

| Param | Type | Description |
| --- | --- | --- |
| cssProperties | <code>CSSStyleDeclaration</code> | A collection of CSS rules |


* [~getAllTransitions(cssProperties)](#module_transitions..getAllTransitions) ⇒ <code>string</code>
    * [~transitions](#module_transitions..getAllTransitions..transitions) : <code>Object</code>
    * [~properties](#module_transitions..getAllTransitions..properties) : <code>Array.&lt;string&gt;</code>

<a name="module_transitions..getAllTransitions..transitions"></a>

#### getAllTransitions~transitions : <code>Object</code>
**Kind**: inner constant of [<code>getAllTransitions</code>](#module_transitions..getAllTransitions)  
<a name="module_transitions..getAllTransitions..properties"></a>

#### getAllTransitions~properties : <code>Array.&lt;string&gt;</code>
**Kind**: inner constant of [<code>getAllTransitions</code>](#module_transitions..getAllTransitions)  
<a name="module_transitions..getTransitionClassName"></a>

### transitions~getTransitionClassName(wTransit, hTransit) ⇒ <code>string</code> \| <code>undefined</code>
Verifies wether there should be widht or height transition, or both, or none

**Kind**: inner method of [<code>transitions</code>](#module_transitions)  
**Returns**: <code>string</code> \| <code>undefined</code> - The name of the class with the respective transition, or undefined if there should be no transitions  

| Param | Type | Description |
| --- | --- | --- |
| wTransit | <code>boolean</code> | Indicates if it should have width transition |
| hTransit | <code>boolean</code> | Indicates if it should have height transition |
