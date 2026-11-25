import { pool } from "../config/db.js";
import { AppError } from "../middleware/errors.js";

// Game calculation formula (isolated from platform meal totals)
const POINTS_PER_MEAL = 25;
const WASTE_PENALTY = 0.5;

function computeGameMeals(saved, wasted) {
  const net = Math.max(0, saved - wasted * WASTE_PENALTY);
  return Math.round((net * 10 * 100) / POINTS_PER_MEAL) / 100;
}

export async function submitScore(req, res, next) {
  const { playerName, points, itemsSaved, itemsWasted } = req.body ?? {};

  const name = String(playerName ?? "").trim().slice(0, 30);
  const ints = [points, itemsSaved, itemsWasted];

  if (!name || !ints.every((n) => Number.isInteger(Number(n)) && Number(n) >= 0 && Number(n) < 1000000)) {
    return next(new AppError("VALIDATION_ERROR", 400, "playerName and non-negative integer stats are required."));
  }

  const meals = computeGameMeals(Number(itemsSaved), Number(itemsWasted));

  try {
    const player = await pool.query(
      `INSERT INTO players (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name]
    );

    const { rows } = await pool.query(
      `INSERT INTO scores (player_id, points, items_saved, items_wasted, estimated_meals)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, estimated_meals`,
      [player.rows[0].id, Number(points), Number(itemsSaved), Number(itemsWasted), meals]
    );

    res.status(201).json({
      id: rows[0].id,
      estimatedMeals: Number(rows[0].estimated_meals),
    });
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboard(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT p.name, MAX(s.points) AS best_points,
              SUM(s.estimated_meals)::float AS total_meals,
              COUNT(*)::int AS games
       FROM scores s
       JOIN players p ON p.id = s.player_id
       GROUP BY p.name
       ORDER BY best_points DESC
       LIMIT 10`
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

/**
 * Game Impact Total (Scores only - completely isolated from real community meal counts).
 */
export async function getImpactTotal(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT COALESCE(SUM(estimated_meals), 0)::float AS game_estimated_meals,
              COUNT(*)::int AS total_games
       FROM scores`
    );
    const total = Number(rows[0]?.total_games ?? rows[0]?.games_played) || 0;
    const meals = Number(rows[0]?.game_estimated_meals) || 0;
    res.json({
      gameEstimatedMeals: meals,
      totalGames: total,
      gamesPlayed: total,
    });
  } catch (err) {
    next(err);
  }
}
