export type Recipients = {
  listId?: string;
  listName?: string;
  userEmail?: string;
  username?: string;
  shareeEmail?: string;
  shareename?: string;
  commenter?: string;
};

export const NotificationTypes = {
  SIGN_UP: 'SIGN_IP',
  LIST_SHARING: 'LIST_SHARING',
  COMMENT: 'COMMENT',
  ACCOUNT_DELETED: 'ACCOUNT_DELETED',
} as const;
export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export const FONT_SETUP = `<style>@import url('https://fonts.cdnfonts.com/css/courier-prime');p {font-family: 'Courier Prime', sans-serif;}</style>`;

export const singup = (recipients: Recipients) => ({
  from: 'CineSync <mail@cinesync.me>',
  to: recipients.userEmail,
  subject: 'Welcome to CineSync!',
  html: `
		${FONT_SETUP}
		<p>Hi there ${recipients.username},</p>
		<p>We're thrilled to welcome you to CineSync! 🎉</p>
		<p>Thank you for joining our community. You're now part of a growing network of users who want to curate, manage, and share their most loved movies.</p>
		<p>To get started and learn more about our service, visit our about page at <a href="https://cinesync.me/dashboard/about">https://cinesync.me/dashboard/about</a>. There you can find information about our application and how it works.
		<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
		<p>We look forward to seeing you thrive in our community and hope you enjoy every moment of your journey with us.</p>
		<p>With love,</p>
		<p>The CineSync Team</p>
		`,
});

export const listShare = (recipients: Recipients) => ({
  from: 'CineSync <mail@cinesync.me>',
  to: recipients.shareeEmail,
  cc: recipients.userEmail,
  subject: 'A user has shared a list with you on CineSync!',
  html: `
	${FONT_SETUP}
	<p>Hi there ${recipients.shareename},</p>
		<p>${recipients.username} has shared the movie list "${recipients.listName}" with you on CineSync! 🎬</p>
		<p>Click <a href="https://cinesync.me/dashboard/list/${recipients.listId}">here</a> to view the list.
		<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
		<p>Enjoy exploring the movies!</p>
		<p>With love,</p>
		<p>The CineSync Team</p>
		`,
});

export const newComment = (recipients: Recipients) => ({
  from: 'CineSync <mail@cinesync.me>',
  to: recipients.userEmail,
  subject: 'A user has commented on one of your lists on CineSync!',
  html: `
	${FONT_SETUP}
	<p>Hi there ${recipients.username},</p>
		<p>${recipients.commenter} has left a comment on the movie list "${recipients.listName}" on CineSync! 💬</p>
		<p>Click <a href="https://cinesync.me/dashboard/list/${recipients.listId}">here</a> to view the list.
		<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
		<p>Enjoy exploring the movies!</p>
		<p>With love,</p>
		<p>The CineSync Team</p>
		`,
});

export const accountDeleted = (recipients: Recipients) => ({
  from: 'CineSync <mail@cinesync.me>',
  to: recipients.userEmail,
  subject: 'Your account has been deleted on CineSync',
  html: `
	${FONT_SETUP}
	<p>Hi there ${recipients.userEmail},</p>
		<p>Your CineSync account has been successfully deleted. We're sorry to see you go. 😢</p>
		<p>If you ever decide to return, we'll be here to welcome you back with open arms.</p>
		<p>If you have any feedback or questions, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
		<p>Thank you for being a part of our community, and we hope to see you again in the future!</p>
		<p>With love,</p>
		<p>The CineSync Team</p>
		`,
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const messageTemplates = new Map<string, Function>([
  [NotificationTypes.SIGN_UP, singup],
  [NotificationTypes.LIST_SHARING, listShare],
  [NotificationTypes.COMMENT, newComment],
  [NotificationTypes.ACCOUNT_DELETED, accountDeleted],
]);
