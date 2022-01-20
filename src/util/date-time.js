/*
Copyright 2020 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import { DateTime } from 'luxon';

export const ago = (duration) => DateTime.local().minus(duration);



////////////////////////////////////////////////////////////////////////////////
// FORMATTING

// We don't expect the user to encounter an invalid DateTime, but if they do, we
// return the string that Luxon returns for an invalid DateTime
// ('Invalid DateTime').

export const formatDate = (dateTime, relative = false) => {
  if (!dateTime.isValid) return dateTime.toString();
  if (relative) {
    const now = DateTime.local();
    // TODO. Remove i18n messages under util.dateTime.
    if (now.hasSame(dateTime, 'day') ||
      now.minus({ days: 1 }).hasSame(dateTime, 'day'))
      return dateTime.toRelativeCalendar({ base: now });
    for (let i = 2; i <= 5; i += 1) {
      if (now.minus({ days: i }).hasSame(dateTime, 'day'))
        return dateTime.weekdayLong;
    }
  }
  // If this changes, DateRangePicker will need to change as well.
  return dateTime.toFormat('y/MM/dd');
};

export const formatTime = (dateTime, seconds = true) => (dateTime.isValid
  ? dateTime.toFormat(seconds ? 'HH:mm:ss' : 'HH:mm')
  : dateTime.toString());

export const formatDateTime = (dateTime, relative = false) => {
  if (!dateTime.isValid) return dateTime.toString();
  const date = formatDate(dateTime, relative);
  const time = formatTime(dateTime, !relative);
  return `${date} ${time}`;
};
