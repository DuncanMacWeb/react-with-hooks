"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShouldCapture = exports.Incomplete = exports.HostEffectMask = exports.LifecycleEffectMask = exports.Passive = exports.Snapshot = exports.Ref = exports.DidCapture = exports.Callback = exports.ContentReset = exports.Deletion = exports.PlacementAndUpdate = exports.Update = exports.Placement = exports.PerformedWork = exports.NoEffect = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Don't change these two values. They're used by React Dev Tools.
var NoEffect =
/*              */
0;
exports.NoEffect = NoEffect;
var PerformedWork =
/*         */
1; // You can change the rest (and add more).

exports.PerformedWork = PerformedWork;
var Placement =
/*             */
2;
exports.Placement = Placement;
var Update =
/*                */
4;
exports.Update = Update;
var PlacementAndUpdate =
/*    */
6;
exports.PlacementAndUpdate = PlacementAndUpdate;
var Deletion =
/*              */
8;
exports.Deletion = Deletion;
var ContentReset =
/*          */
16;
exports.ContentReset = ContentReset;
var Callback =
/*              */
32;
exports.Callback = Callback;
var DidCapture =
/*            */
64;
exports.DidCapture = DidCapture;
var Ref =
/*                   */
128;
exports.Ref = Ref;
var Snapshot =
/*              */
256;
exports.Snapshot = Snapshot;
var Passive =
/*               */
512; // Passive & Update & Callback & Ref & Snapshot

exports.Passive = Passive;
var LifecycleEffectMask =
/*   */
932; // Union of all host effects

exports.LifecycleEffectMask = LifecycleEffectMask;
var HostEffectMask =
/*        */
1023;
exports.HostEffectMask = HostEffectMask;
var Incomplete =
/*            */
1024;
exports.Incomplete = Incomplete;
var ShouldCapture =
/*         */
2048;
exports.ShouldCapture = ShouldCapture;