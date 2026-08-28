<?php

namespace App\Services;

use RuntimeException;

/**
 * Thrown when a call is refused because its circuit breaker is open.
 *
 * Distinct from a transport failure on purpose: the caller must be able to tell
 * "we did not even try" from "we tried and it failed", because the credit gate refunds
 * on one and never reserves on the other.
 */
class CircuitOpenException extends RuntimeException {}
