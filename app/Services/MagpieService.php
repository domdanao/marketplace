<?php

namespace App\Services;

use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MagpieService
{
    private string $apiKey;

    private string $baseUrl;

    private string $customersUrl;

    private string $chargesUrl;

    private string $checkoutUrl;

    public function __construct()
    {
        $this->apiKey = config('services.magpie.api_key');
        $this->baseUrl = config('services.magpie.api_base_url');
        $this->customersUrl = config('services.magpie.customers_url');
        $this->chargesUrl = config('services.magpie.charges_url');
        $this->checkoutUrl = config('services.magpie.checkout_url');
    }

    public function createCharge(array $data): array
    {
        $response = $this->makeRequest('POST', $this->chargesUrl, [
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'PHP',
            'description' => $data['description'] ?? null,
            'customer_id' => $data['customer_id'] ?? null,
            'metadata' => $data['metadata'] ?? [],
            'source' => $data['source'] ?? null,
        ]);

        return $response->json();
    }

    public function createCustomer(array $data): array
    {
        $response = $this->makeRequest('POST', $this->customersUrl, [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'metadata' => $data['metadata'] ?? [],
        ]);

        return $response->json();
    }

    public function retrieveCharge(string $chargeId): array
    {
        $response = $this->makeRequest('GET', $this->chargesUrl.'/'.$chargeId);

        return $response->json();
    }

    public function refundCharge(string $chargeId, ?int $amount = null): array
    {
        $payload = [];
        if ($amount !== null) {
            $payload['amount'] = $amount;
        }

        $response = $this->makeRequest('POST', $this->chargesUrl.'/'.$chargeId.'/refund', $payload);

        return $response->json();
    }

    public function createCheckoutSession(array $data): array
    {
        $response = $this->makeRequest('POST', $this->checkoutUrl, [
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'PHP',
            'description' => $data['description'] ?? null,
            'success_url' => $data['success_url'],
            'cancel_url' => $data['cancel_url'],
            'customer_id' => $data['customer_id'] ?? null,
            'metadata' => $data['metadata'] ?? [],
        ]);

        return $response->json();
    }

    public function verifyWebhookSignature(string $payload, string $signature, string $secret): bool
    {
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        return hash_equals($expectedSignature, $signature);
    }

    private function makeRequest(string $method, string $url, array $data = []): Response
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(30);

            $response = match (strtoupper($method)) {
                'GET' => $response->get($url, $data),
                'POST' => $response->post($url, $data),
                'PUT' => $response->put($url, $data),
                'DELETE' => $response->delete($url, $data),
                default => throw new Exception("Unsupported HTTP method: {$method}"),
            };

            if (! $response->successful()) {
                Log::error('Magpie API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'url' => $url,
                    'method' => $method,
                ]);

                throw new Exception(
                    'Magpie API request failed: '.$response->body(),
                    $response->status()
                );
            }

            return $response;
        } catch (Exception $e) {
            Log::error('Magpie Service Error', [
                'message' => $e->getMessage(),
                'url' => $url,
                'method' => $method,
                'data' => $data,
            ]);

            throw $e;
        }
    }

    public function formatAmount(float $amount): int
    {
        return (int) ($amount * 100);
    }

    public function formatCurrency(int $centavos): float
    {
        return $centavos / 100;
    }
}
