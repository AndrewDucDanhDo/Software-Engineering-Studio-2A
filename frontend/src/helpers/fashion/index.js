import React from "react";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import clsx from "clsx";

/***
 * Style a component similar to {@link https://material-ui.com/styles/basics/#styled-components-api|material-ui styled-components}
 * which was inspired by {@link https://styled-components.com/|styled-components}
 *
 * This is the similar to {@link fashion} but you modify any single css class of your liking simillar to how you would do it with
 * {@link makeStyles}. This function might be useful in situations where you want to override material-ui styling.
 *
 * @example Fashion with access to the theme.
 * const RoundedButton = hardFashion(Button, (theme) => ({
 *     root: {
 *         backgroundColor: "#4F7CE0",
 *         borderRadius: 15,
 *         "&:hover": {
 *             backgroundColor: "#7290D3"
 *         }
 *         padding: theme.padding(2)
 *     },
 *     label: {
 *         color: "white"
 *     }
 * }));
 * @example A shorthand for making styles simply with an object.
 * const RoundedButton = hardFashion(Button, {
 *     root: {
 *         backgroundColor: "#4F7CE0",
 *         borderRadius: 15,
 *         "&:hover": {
 *             backgroundColor: "#7290D3"
 *         }
 *     },
 *     label: {
 *         color: "white"
 *     }
 * });
 *
 * @typedef {Object} Style
 * @typedef {Object} Theme
 *
 * @param {React.ComponentClass} BaseComponent The component to style
 * @param {function(Theme, React.ComponentProps) | Style} styling Can either be an object with styles or a function(theme, props) that returns the styles
 * @returns {React.FunctionComponent} A new React Component with the applied styles
 */
export function hardFashion(BaseComponent, styling) {
    return function FashionedComponent(props) {
        const theme = useTheme();
        let useStyles;

        if (typeof styling == "function") {
            const styles = styling(theme, props);
            useStyles = makeStyles(styles);
        } else if (typeof styling == "object") {
            useStyles = makeStyles(styling);
        } else {
            throw new Error(`Cannot fashion with ${styling}`)
        }

        const classes = useStyles();
        return (<BaseComponent classes={{...classes, ...props.classes}} {...props}/>);
    };
}

/***
 * Style a component similar to {@link https://material-ui.com/styles/basics/#styled-components-api|material-ui styled-components}
 * which was inspired by {@link https://styled-components.com/|styled-components}
 *
 * This is the similar to {@link hardFashion} but is a quick and easy way to style a component, just simply plug in css into an
 * object and pass it in!
 *
 * @example Fashion with access to the theme.
 * const BoxedSpace = fashion(Box, (theme) => ({
 *     border: "solid 1px rgba(0, 0, 0, 0.4)",
 *     borderRadius: 15,
 *     padding: theme.padding(2)
 * }));
 * @example A shorthand for making styles simply with an object.
 * const BoxedSpace = fashion(Box, {
 *     border: "solid 1px rgba(0, 0, 0, 0.4)",
 *     borderRadius: 15,
 * });
 *
 * @typedef {Object} Style
 * @typedef {Object} Theme
 *
 * @param {React.ComponentClass} BaseComponent The component to style
 * @param {function(Theme, React.ComponentProps) | Style} styling Can either be an object with styles or a function(theme, props) that returns the styles
 * @returns {React.FunctionComponent} A new React Component with the applied styles
 */
export function fashion(BaseComponent, styling) {
    return function FashionedComponent(props) {
        const theme = useTheme();
        let useStyles;

        if (typeof styling == "function") {
            const styles = styling(theme, props);
            useStyles = makeStyles({root: styles});
        } else if (typeof styling == "object") {
            useStyles = makeStyles({root: styling});
        } else {
            throw new Error(`Cannot fashion with ${styling}`)
        }

        const classes = useStyles();
        return (<BaseComponent className={clsx(classes.root, props.className)} {...props}/>);
    };
}