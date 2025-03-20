import * as moment from "moment-timezone";

export const generateAuditReportPdf = (
  staffDetails: {
    name: string;
    role: string;
    witness: string;
    date: string;
    status: string;
  },
  questionsAndAnswers: { question: string; answer: string }[]
) => {
  const formattedDate = moment(staffDetails.date).format("DD/MM/YYYY HH:mm");

  return `
      <html lang="en">
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 20px;
            font-family: Arial, sans-serif;
        }
        .header-section {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .staff-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .staff-info {
            font-size: 14px;
        }
        .status {
            font-weight: bold;
            color: green;
            background-color: #e0f7e9;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .section-content {
            font-size: 14px;
            text-align: justify;
        }
        .weekly-audit {
            margin-top: 10px;
            font-size: 14px;
        }

        .qa-section {
            margin-top: 15px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .qa-question {
            font-weight: bold;
            color: #333;
        }
        .qa-answer {
            margin-top: 5px;
            padding-left: 10px;
        }
        </style>
        <body>

        <div class="header-section">Weekly CD Report Details</div>

        <div class="staff-details">
            <div class="staff-info">
                <div><strong>${staffDetails.name}</strong></div>
                <div>${staffDetails.role}</div>
            </div>
            <div class="staff-info">
                <div><strong>Witness:</strong> ${staffDetails.witness}</div>
                <div><strong>Date:</strong> ${formattedDate}</div>
            </div>
            <div class="status">${staffDetails.status}</div>
        </div>

        <div class="section">
            <div class="section-title">SAFE</div>
            <div class="section-content">
                We make sure that medicines and treatments are safe and meet people’s needs...
            </div>
        </div>

        <div class="section">
            <div class="section-title">EFFECTIVE</div>
            <div class="section-content">
                We maximise the effectiveness of people’s care and treatment...
            </div>
        </div>

        <div class="section">
            <div class="section-title">RESPONSIVE</div>
            <div class="section-content">
                We make sure people are at the centre of their care...
            </div>
        </div>

        <div class="section">
            <div class="section-title">WELL LED</div>
            <div class="section-content">
                We have clear responsibilities, roles, systems of accountability...
            </div>
        </div>
         <div class="weekly-audit">
            <div class="section-title">Weekly CD Audit</div>
            <ul>
                <li>The weekly stock check should take place on the same day each week...</li>
                <li>The check should be initialed as compliant...</li>
                <li>Where possible, errors should be corrected...</li>
                <li>Remedial actions should be recorded...</li>
                <li>Checks should be performed by verifying the balance...</li>
            </ul>
        </div>

        <div class="qa-section">
            <div class="section-title">Audit Questions & Answers</div>
            ${questionsAndAnswers
              .map(
                (qna) => `
                <div class="qa-entry">
                    <div class="qa-question">✅ ${qna.question}</div>
                    <div class="qa-answer">${qna.answer}</div>
                </div>
            `
              )
              .join("")}
        </div>

    </body>
</html>
    `;
};
