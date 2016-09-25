/**
 * Created by tushar.mathur on 25/09/16.
 */

/// <reference path="../typings/window-or-global.d.ts"/>
import {HTMLElement} from "window-or-global";
import HTMLElementShim from "./HTMLElementShim";

export default HTMLElement || HTMLElementShim
