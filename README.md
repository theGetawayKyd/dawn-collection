# Dawn with Brand Switching

[![Build status](https://github.com/shopify/dawn/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Shopify/dawn/actions/workflows/ci.yml?query=branch%3Amain)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?color=informational)](/.github/CONTRIBUTING.md)

[Getting started](#getting-started) |
[Brand Switching Module](#brand-switching-module) |
[Staying up to date with Dawn changes](#staying-up-to-date-with-dawn-changes) |
[Developer tools](#developer-tools) |
[Contributing](#contributing) |
[Code of conduct](#code-of-conduct) |
[Theme Store submission](#theme-store-submission) |
[License](#license)

Dawn represents a HTML-first, JavaScript-only-as-needed approach to theme development. It's Shopify's first source available theme with performance, flexibility, and [Online Store 2.0 features](https://www.shopify.com/partners/blog/shopify-online-store) built-in and acts as a reference for building Shopify themes.

* **Web-native in its purest form:** Themes run on the [evergreen web](https://www.w3.org/2001/tag/doc/evergreen-web/). We leverage the latest web browsers to their fullest, while maintaining support for the older ones through progressive enhancement—not polyfills.
* **Lean, fast, and reliable:** Functionality and design defaults to “no” until it meets this requirement. Code ships on quality. Themes must be built with purpose. They shouldn’t support each and every feature in Shopify.
* **Server-rendered:** HTML must be rendered by Shopify servers using Liquid. Business logic and platform primitives such as translations and money formatting don’t belong on the client. Async and on-demand rendering of parts of the page is OK, but we do it sparingly as a progressive enhancement.
* **Functional, not pixel-perfect:** The Web doesn’t require each page to be rendered pixel-perfect by each browser engine. Using semantic markup, progressive enhancement, and clever design, we ensure that themes remain functional regardless of the browser.

You can find a more detailed version of our theme code principles in the [contribution guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md#theme-code-principles).

## Getting started
We recommend using Dawn as a starting point for theme development. [Learn more on Shopify.dev](https://shopify.dev/themes/getting-started/create).

> If you're building a theme for the Shopify Theme Store, then you can use Dawn as a starting point. However, the theme that you submit needs to be [substantively different from Dawn](https://shopify.dev/themes/store/requirements#uniqueness) so that it provides added value for merchants. Learn about the [ways that you can use Dawn](https://shopify.dev/themes/tools/dawn#ways-to-use-dawn).

Please note that the main branch may include code for features not yet released. The "stable" version of Dawn is available in the theme store.

## Brand Switching Module

This theme includes a brand switching module that allows customers to switch between different brands within a single store. The implementation is primarily server-side using Liquid with minimal JavaScript.

### Features

- Brand-specific product templates customizable through the theme editor
- Brand-specific collection templates customizable through the theme editor
- Brand-specific cart templates customizable through the theme editor
- Brand-specific CSS styling
- Brand banner in header for brand switching

### How It Works

1. **Brand Selection**: Brand selection is stored in `cart.attributes.selected_brand` and persists throughout the customer's session.

2. **Metaobjects**: Brand information is stored in Shopify metaobjects. Each brand metaobject includes:
   - `brand_handle`: Unique identifier for the brand
   - `title`: Display name of the brand
   - `logo`: Brand logo image
   - `menu_handle`: Handle of the menu to use for this brand
   - `link`: URL for the brand's landing page

3. **Template Handling**: The system dynamically loads brand-specific templates based on the selected brand using the brand template controller:
   - Product templates: Customizable through the theme editor using `brand-customizable-product-[brand_handle].liquid` sections
   - Collection templates: Customizable through the theme editor using `brand-customizable-collection-[brand_handle].liquid` sections
   - Cart templates: Customizable through the theme editor using `brand-customizable-cart-[brand_handle].liquid` sections

4. **CSS Styling**: Brand-specific CSS is loaded from `assets/[brand_handle].css`

### Implementation

- **Brand Banner**: `snippets/brand-banner.liquid` - Displays a horizontal list of brand logos for switching
- **Brand Menu**: `snippets/brand-menu.liquid` - Loads brand-specific navigation menus
- **Brand Template Controller**: `sections/brand-template-controller.liquid` - Central controller for loading brand-specific templates
- **Brand Customizable Product**: `sections/brand-customizable-product.liquid` - Customizable product template section for brands
- **Brand Customizable Collection**: `sections/brand-customizable-collection.liquid` - Customizable collection template section for brands
- **Brand Customizable Cart**: `sections/brand-customizable-cart.liquid` - Customizable cart template section for brands

### Setup Instructions

1. **Create Brand Metaobjects**:
   - In Shopify Admin, go to Settings > Custom data > Metaobjects
   - Create a metaobject definition called "brand" with fields:
     - brand_handle (single line text)
     - title (single line text)
     - logo (file reference)
     - menu_handle (single line text)
     - link (single line text or URL)
   - Create entries for each brand

2. **Add Brand Banner to Header**:
   - The brand banner is already integrated into the header section
   - You can enable/disable it in the theme editor under Header > Show brand banner

3. **Create Brand-Specific Templates Using the Theme Editor**:
   - Go to the theme editor and navigate to Templates > Product, Collection, or Cart
   - Add the Brand Template Controller section to your template
   - Configure the controller with the appropriate page type (product, collection, or cart)
   - Add brand template blocks for each brand you want to support
   - For each brand block, specify:
     - Brand Handle: The unique identifier that matches the metaobject brand_handle field
     - Section ID: The ID of the customizable section to use (e.g., 'brand-customizable-product-xyz')
   - Create and customize brand-specific sections using the theme editor

4. **Create and Customize Brand-Specific Sections**:
   - In the theme editor, go to Sections > Add section
   - Add a new section using one of the brand customizable templates:
     - Brand Customizable Product
     - Brand Customizable Collection
     - Brand Customizable Cart
   - Configure the section with the appropriate brand handle
   - Customize the section's appearance, layout, and content blocks
   - The section will only appear when the customer has selected the matching brand

5. **Create Brand-Specific CSS**:
   - For each brand, create a CSS file in the assets folder with the brand handle as the filename
   - Example: `xyz.css` for the XYZ brand

### Debugging

If you encounter issues with the brand switching system:

1. **Enable Debug Mode in Brand Template Controller**:
   - In the theme editor, edit the Brand Template Controller section
   - Enable the "Show debug information" setting
   - This will display information about the selected brand, available brands, and template loading

2. **Check Metaobject Configuration**:
   - Ensure that all required fields are present in your brand metaobjects
   - Verify that the brand_handle values match exactly what you've configured in your templates

3. **Verify Template Configuration**:
   - Check that your brand template controller blocks are correctly configured
   - Ensure that the section IDs match your customizable brand sections

4. **Inspect Cart Attributes**:
   - The selected brand is stored in `cart.attributes.selected_brand`
   - You can clear this by setting a blank value or clearing the cart

## Staying up to date with Dawn changes

Say you're building a new theme off Dawn but you still want to be able to pull in the latest changes, you can add a remote `upstream` pointing to this Dawn repository.

1. Navigate to your local theme folder.
2. Verify the list of remotes and validate that you have both an `origin` and `upstream`:
```sh
git remote -v
```
3. If you don't see an `upstream`, you can add one that points to Shopify's Dawn repository:
```sh
git remote add upstream https://github.com/Shopify/dawn.git
```
4. Pull in the latest Dawn changes into your repository:
```sh
git fetch upstream
git pull upstream main
```

## Developer tools

There are a number of really useful tools that the Shopify Themes team uses during development. Dawn is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://github.com/Shopify/shopify-cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes—everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://shopify.dev/docs/themes/tools/cli) to get started.

### Theme Check

We recommend using [Theme Check](https://github.com/shopify/theme-check) as a way to validate and lint your Shopify themes.

We've added Theme Check to Dawn's [list of VS Code extensions](/.vscode/extensions.json) so if you're using Visual Studio Code as your code editor of choice, you'll be prompted to install the [Theme Check VS Code](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension upon opening VS Code after you've forked and cloned Dawn.

You can also run it from a terminal with the following Shopify CLI command:

```bash
shopify theme check
```

### Continuous Integration

Dawn uses [GitHub Actions](https://github.com/features/actions) to maintain the quality of the theme. [This is a starting point](https://github.com/Shopify/dawn/blob/main/.github/workflows/ci.yml) and what we suggest to use in order to ensure you're building better themes. Feel free to build off of it!

#### Shopify/lighthouse-ci-action

We love fast websites! Which is why we created [Shopify/lighthouse-ci-action](https://github.com/Shopify/lighthouse-ci-action). This runs a series of [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) audits for the home, product and collections pages on a store to ensure code that gets added doesn't degrade storefront performance over time.

#### Shopify/theme-check-action

Dawn runs [Theme Check](#Theme-Check) on every commit via [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action).

## Contributing

Want to make commerce better for everyone by contributing to Dawn? We'd love your help! Please read our [contributing guide](https://github.com/Shopify/dawn/blob/main/.github/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build for Dawn.

## Code of conduct

All developers who wish to contribute through code or issues, please first read our [Code of Conduct](https://github.com/Shopify/dawn/blob/main/.github/CODE_OF_CONDUCT.md).

## Theme Store submission

The [Shopify Theme Store](https://themes.shopify.com/) is the place where Shopify merchants find the themes that they'll use to showcase and support their business. As a theme partner, you can create themes for the Shopify Theme Store and reach an international audience of an ever-growing number of entrepreneurs.

Ensure that you follow the list of [theme store requirements](https://shopify.dev/themes/store/requirements) if you're interested in becoming a [Shopify Theme Partner](https://themes.shopify.com/services/themes/guidelines) and building themes for the Shopify platform.

## License

Copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md) for further details.
