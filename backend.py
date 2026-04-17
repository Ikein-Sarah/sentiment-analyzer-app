from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import uvicorn

app = FastAPI()


# --- Request / Response models ---

class AnalyzeRequest(BaseModel):
    reviews: list[str]
    api_key: str


class ReviewResult(BaseModel):
    review: str
    sentiment: str


class AnalyzeResponse(BaseModel):
    results: list[ReviewResult]


class SummarizeRequest(BaseModel):
    groups: dict[str, list[str]]
    api_key: str


class SummarizeResponse(BaseModel):
    summaries: dict[str, str]


# --- Endpoints ---

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    """Classify each review as positive, negative, or neutral.

    Iterates over the reviews in the request, calls GPT-4o to classify
    each one as positive, negative, or neutral, and returns the results.

    Args:
        request: Request body containing a list of review strings and an
            OpenAI API key.

    Returns:
        An AnalyzeResponse containing a list of objects, each with the
        original review text and its predicted sentiment label.
    """
    client = OpenAI(api_key=request.api_key)
    results = []

    for review_text in request.reviews:
        prompt = f'''Classify the following customer review.
State your answer
as a single word, "positive",
"negative" or "neutral":

{review_text}
'''
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
        )
        sentiment = completion.choices[0].message.content.strip().lower()
        results.append(ReviewResult(review=review_text, sentiment=sentiment))

    return AnalyzeResponse(results=results)


@app.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest):
    """Summarize key themes for each sentiment group of reviews.

    For each non-empty group in the request, calls GPT-4o to produce a
    2-3 sentence summary of the main themes. Empty groups are skipped.

    Args:
        request: Request body containing a mapping of sentiment labels to
            lists of review strings, plus an OpenAI API key.

    Returns:
        A SummarizeResponse whose summaries dict maps each sentiment label
        to a 2-3 sentence theme summary produced by GPT-4o.
    """
    client = OpenAI(api_key=request.api_key)
    summaries = {}

    for sentiment_label, reviews in request.groups.items():
        if not reviews:
            continue

        joined = "\n- ".join(reviews)
        prompt = (
            f"The following are {sentiment_label} customer reviews:\n"
            f"- {joined}\n\n"
            f"In 2-3 sentences, summarize the main themes of these {sentiment_label} reviews."
        )

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes customer feedback.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        summaries[sentiment_label] = completion.choices[0].message.content.strip()

    return SummarizeResponse(summaries=summaries)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
