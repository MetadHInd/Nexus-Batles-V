from groq import AsyncClient

from src.application.ports.ai_gateway_port import AIGatewayPort, AIGatewayError


class GroqAIGateway(AIGatewayPort):
    """Adaptador de IA para un proveedor externo.

    Usa Groq para generar respuestas basadas en el conocimiento disponible.
    """

    def __init__(self, api_key: str, api_url: str = "https://api.groq.com", model: str = "meta-llama/llama-4-scout-17b-16e-instruct"):
        self._api_key = api_key
        self._api_url = api_url.rstrip("/")
        if self._api_url.endswith("/openai/v1"):
            self._api_url = self._api_url[: -len("/openai/v1")]
        self._model = model

    async def generate_response(
        self,
        system_prompt: str,
        history: list[dict],
        user_message: str,
    ) -> str:
        if not self._api_key:
            raise AIGatewayError("API key de Groq no configurada")

        messages = [
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": user_message},
        ]

        try:
            async with AsyncClient(api_key=self._api_key, base_url=self._api_url) as client:
                response = await client.chat.completions.create(
                    messages=messages,
                    model=self._model,
                    temperature=0.7,
                    max_tokens=512,
                    user="nexus-bot",
                )
        except Exception as exc:
            raise AIGatewayError(f"Error en el gateway de IA: {exc}") from exc

        if not getattr(response, "choices", None):
            raise AIGatewayError("El gateway de IA no devolvió una respuesta válida")

        first_choice = response.choices[0]
        message = getattr(first_choice, "message", None)
        content = getattr(message, "content", None) if message is not None else None

        if not content:
            raise AIGatewayError("El gateway de IA devolvió una respuesta vacía")

        return content.strip()
