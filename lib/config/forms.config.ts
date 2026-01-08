/**
 * Forms Configuration
 * Controls form plugin support, styling, and script loading behavior
 */

export const formsConfig = {
  /**
   * WPForms settings
   * Configure behavior for WPForms shortcodes rendered via WordPress
   */
  wpforms: {
    /** Enable WPForms support */
    enabled: true,
    /** Use default WPForms CSS styles (false = custom Tailwind styles) */
    useDefaultStyles: true,
    /** Initialize WPForms JS after Next.js hydration */
    loadScripts: true,
  },

  /**
   * Contact Form 7 settings (future support)
   * Configure behavior for CF7 shortcodes rendered via WordPress
   */
  contactForm7: {
    /** Enable Contact Form 7 support */
    enabled: false,
    /** Use default CF7 CSS styles (false = custom Tailwind styles) */
    useDefaultStyles: true,
    /** Initialize CF7 JS after Next.js hydration */
    loadScripts: true,
  },

  /**
   * Gravity Forms settings (future support)
   * Configure behavior for Gravity Forms shortcodes rendered via WordPress
   */
  gravityForms: {
    /** Enable Gravity Forms support */
    enabled: false,
    /** Use default Gravity Forms CSS styles (false = custom Tailwind styles) */
    useDefaultStyles: true,
    /** Initialize Gravity Forms JS after Next.js hydration */
    loadScripts: true,
    /** Enable AJAX form submission */
    ajaxSubmit: true,
  },
} as const;

export type FormsConfig = typeof formsConfig;
export type WPFormsConfig = typeof formsConfig.wpforms;
export type ContactForm7Config = typeof formsConfig.contactForm7;
export type GravityFormsConfig = typeof formsConfig.gravityForms;
