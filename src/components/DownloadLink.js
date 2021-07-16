import React from 'react';

const DownloadLink = ({props: {url, showLink}}) => {
    return (
        <a href={url} className={ showLink ? "d-block" : "d-none" } download="data.csv">data.csv</a>
    );
}

export default DownloadLink