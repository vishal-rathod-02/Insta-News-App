export const formatArticleDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};
