import { fashion } from "../../helpers/fashion";
import Box from "@material-ui/core/Box";

const StretchBox = fashion(Box, {
    width: "100%",
    height: "100%"
});

export default StretchBox;