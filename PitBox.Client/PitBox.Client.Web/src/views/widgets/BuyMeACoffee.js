import { CLink } from '@coreui/react';
import React from 'react';

function BuyMeACoffee(props) {
    return (
        <CLink {...props} target="_blank" href="https://www.buymeacoffee.com/virtualpitbox">
            Buy me a coffee
        </CLink>
    );
}

export default BuyMeACoffee;