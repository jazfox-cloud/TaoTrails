document.querySelectorAll("[data-email-user][data-email-domain]").forEach((link) => {
  const address = `${link.dataset.emailUser}@${link.dataset.emailDomain}`;
  link.href = `mailto:${address}`;
  link.textContent = address;
});
