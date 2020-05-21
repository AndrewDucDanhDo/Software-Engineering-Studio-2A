import Button from "@material-ui/core/Button";
import {hardFashion} from "../../helpers/fashion";

const RoundedButton = hardFashion(Button, (theme, props) => ({
    root: {
        backgroundColor: theme.mainColor,
        borderRadius: 15,
        "&:hover": {
            backgroundColor: "#7290D3"
        }
    },
    label: {
        color: props.color || "white"
    }
}));

export default RoundedButton;