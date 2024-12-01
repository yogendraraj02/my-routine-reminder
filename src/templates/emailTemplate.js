export const getEmailTemplate = (routines) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const routinesList = routines
    .map(routine => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${routine.time}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${routine.task}</strong><br />
          ${routine.duration ? `<em>Duration:</em> ${routine.duration}<br />` : ''}
          ${routine.focus ? `<em>Focus:</em> ${routine.focus}<br />` : ''}
          ${routine.details ? `<em>Details:</em> ${routine.details}<br />` : ''}
          ${routine.activities ? `
            <em>Activities:</em>
            <ul style="margin: 5px 0 0 20px; padding: 0;">
              ${routine.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
          ` : ''}
        </td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Routine Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Daily Routine Reminder</h1>
          <p style="color: #666;">Hello!</p>
          <p style="color: #666;">Here's your schedule for ${today}:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left;">Time</th>
                <th style="padding: 12px; text-align: left;">Task</th>
              </tr>
            </thead>
            <tbody>
              ${routinesList}
            </tbody>
          </table>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-style: italic;">
              "The only way to do great work is to love what you do." - Steve Jobs
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
            <p style="font-size: 12px;">
              To unsubscribe from these reminders, <a href="{unsubscribe_url}" style="color: #007bff;">click here</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
