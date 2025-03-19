import { KeyLogEntity } from '@packages/entities/public';
import * as moment from 'moment-timezone';
export const generateKeylogReportPdf = (keyLogs: KeyLogEntity[], timeZone: string) => {
    return `
      <html lang="">
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 10px;
            font-family: Arial, sans-serif;
        }
        .header-section {
            margin-bottom: 20px;
            font-weight: bold;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        .status-checked-in {
            color: red;
            font-weight: bold;
        }
        .status-checked-out {
            color: green;
            font-weight: bold;
        }
        </style>
        <body>
        <div class="header-section">KeyLog REPORT</div>
        <table>
            <thead>
                <tr>
                    <th>Authorized keylog Name</th>
                    <th>Last Shift</th>
                    <th>Last Hold Key Number</th>
                    <th>Last Key Check-in Time</th>
                    <th>Last Key Check-out Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${keyLogs
                    .map(
                        keylog => `
                        <tr>
                            <div>${keylog.userInfo.firstName} ${keylog.userInfo.lastName}</div>
                            <div>${keylog.userInfo.role}</div>
                            <td>${keylog.shift === 1 ? ' 8:00 AM - 8:00 PM' : '8:00 PM - 8:00 AM'}</td>
                            <td>${keylog.keyNumber}</td>
                            <td>${keylog.checkInTime ? moment.tz(keylog.checkInTime, timeZone).format('DD/MM/YYYY HH:mm') : '---'}</td>
                            <td>${keylog.checkOutTime ? moment.tz(keylog.checkOutTime, timeZone).format('DD/MM/YYYY HH:mm') : '---'}</td>
                            <td class="${keylog.status === 1 ? 'status-checked-in' : 'status-checked-out'}">
                                ${keylog.status === 1 ? 'checked-in' : 'checked-out'}
                            </td>
                        </tr>`,
                    )
                    .join('')}
            </tbody>
        </table>
    </body>
</html>
    `;
};
 