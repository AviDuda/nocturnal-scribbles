/**
 * Geocities theme bundle entry point.
 * Bundles theme + music player into a single file for lazy loading.
 */

import { applyGeocitiesStyles } from "./theme.ts";

// Expose on window for the theme switcher
window.applyGeocitiesTheme = applyGeocitiesStyles;
