import streamlit as st
import requests
import pandas as pd
import plotly.express as px

st.title("🥗 Customer Review Sentiment Analyzer")
st.markdown("This app analyzes the sentiment of customer reviews to gain insights into their opinions.")

# OpenAI API Key input
openai_api_key = st.sidebar.text_input(
    "Enter your OpenAI API Key",
    type="password",
    help="You can find your API key at https://platform.openai.com/account/api-keys"
)

BACKEND_URL = "http://localhost:8000"

def analyze_reviews(reviews):
    """Send reviews to the backend API for sentiment classification.

    Args:
        reviews: List of review texts to classify.

    Returns:
        A list of dicts with "review" and "sentiment" keys, or None if
        the backend request fails.
    """
    response = requests.post(
        f"{BACKEND_URL}/analyze",
        json={"reviews": reviews, "api_key": openai_api_key}
    )
    if not response.ok:
        st.error(response.text)
        return None
    return response.json()["results"]


def summarize_reviews(positive_reviews, negative_reviews):
    """Send grouped reviews to the backend API for theme summarization.

    Args:
        positive_reviews: List of review texts classified as positive.
        negative_reviews: List of review texts classified as negative.

    Returns:
        A dict mapping "positive" and "negative" to their respective
        2-3 sentence theme summaries, or None if the backend request fails.
    """
    response = requests.post(
        f"{BACKEND_URL}/summarize",
        json={
            "groups": {"positive": positive_reviews, "negative": negative_reviews},
            "api_key": openai_api_key
        }
    )
    if not response.ok:
        st.error(response.text)
        return None
    return response.json()["summaries"]


# CSV file uploader
uploaded_file = st.file_uploader(
    "Upload a CSV file with restaurant reviews",
    type=["csv"])

# Once the user uploads a csv file:
if uploaded_file is not None:
    # Read the file
    reviews_df = pd.read_csv(uploaded_file)

    # Check if the data has a text column
    text_columns = reviews_df.select_dtypes(include="object").columns

    if len(text_columns) == 0:
        st.error("No text columns found in the uploaded file.")

    # Show a dropdown menu to select the review column
    review_column = st.selectbox(
        "Select the column with the customer reviews",
        text_columns
    )

    # Analyze the sentiment of the selected column
    reviews_list = reviews_df[review_column].tolist()
    results = analyze_reviews(reviews_list)

    if results is not None:
        reviews_df["sentiment"] = [r["sentiment"] for r in results]

        # Display the sentiment distribution in metrics in 3 columns: Positive, Negative, Neutral
        # Make the strings in the sentiment column titled
        reviews_df["sentiment"] = reviews_df["sentiment"].str.title()
        sentiment_counts = reviews_df["sentiment"].value_counts()

        # Create 3 columns to display the 3 metrics
        col1, col2, col3 = st.columns(3)

        with col1:
            # Show the number of positive reviews and the percentage
            positive_count = sentiment_counts.get("Positive", 0)
            st.metric("Positive",
                      positive_count,
                      f"{positive_count / len(reviews_df) * 100:.2f}%")

        with col2:
            # Show the number of neutral reviews and the percentage
            neutral_count = sentiment_counts.get("Neutral", 0)
            st.metric("Neutral",
                      neutral_count,
                      f"{neutral_count / len(reviews_df) * 100:.2f}%")

        with col3:
            # Show the number of negative reviews and the percentage
            negative_count = sentiment_counts.get("Negative", 0)
            st.metric("Negative",
                      negative_count,
                      f"{negative_count / len(reviews_df) * 100:.2f}%")

        # Display pie chart
        fig = px.pie(
            values=sentiment_counts.values,
            names=sentiment_counts.index,
            title='Sentiment Distribution'
        )
        st.plotly_chart(fig)

        # Summaries of positive and negative reviews
        st.subheader("Review Summaries")

        positive_reviews = reviews_df[reviews_df["sentiment"] == "Positive"][review_column].tolist()
        negative_reviews = reviews_df[reviews_df["sentiment"] == "Negative"][review_column].tolist()

        col_pos, col_neg = st.columns(2)

        with col_pos:
            st.markdown("**What customers love**")
            if not positive_reviews:
                st.write("No positive reviews to summarize.")

        with col_neg:
            st.markdown("**Main complaints**")
            if not negative_reviews:
                st.write("No negative reviews to summarize.")

        if positive_reviews or negative_reviews:
            summaries = summarize_reviews(positive_reviews, negative_reviews)
            if summaries is not None:
                with col_pos:
                    if positive_reviews:
                        st.write(summaries.get("positive", ""))
                with col_neg:
                    if negative_reviews:
                        st.write(summaries.get("negative", ""))
