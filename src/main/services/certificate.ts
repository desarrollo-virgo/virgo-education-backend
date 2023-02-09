const certificate = `
<html>
    <head>
        <style type='text/css'>
            body, html {
                margin: 0;
                padding: 0;
            }
            body {
                color: black;
                display: table;
                font-family: Georgia, serif;
                text-align: center;
            }
        </style>
    </head>
    <body style="width:4961px;height: 3508px;">
        <img src="https://stprocesosdiarios.blob.core.windows.net/test/certificateBKG.svg" style="z-index: -5;position: absolute;top:0;left:0;width:4961px"/>
        <div style = "width: 100%;height: 100%;background-position: center; background-repeat: no-repeat;background-size: cover;">
            <div style="padding-top: 25%;font-size: 128px;">
                
                <strong>[%NAME%]</strong>
            </div>
            <div style="padding-top: 12%;font-size: 120px;">
                [%COURSE%]
            </div>
            <div style="padding-top: 6%;font-size: 90px;">
                [%PROFESSOR%]
            </div>
            <div style="padding-top: 2%;font-size: 70px;">
                [%DATE%]
            </div>
        </div>
    </body>
</html>

`

export default certificate