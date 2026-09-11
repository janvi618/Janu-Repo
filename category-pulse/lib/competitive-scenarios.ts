export type CompetitorScenario = { move: string; assumption: string; response: string; effect: string };
export const competitorScenarios: Record<string, CompetitorScenario[]> = {
  bundle: [
    { move: 'Copies bundle + discounts', assumption: 'A competitor can copy the assortment and offer it at a lower feasible price.', response: 'Compare selection usefulness and replenishment against the discounted incumbent assortment.', effect: 'Price pressure weakens the assortment advantage. Require paid repeat and incremental contribution before advancing.' },
    { move: 'Matches assortment', assumption: 'A competitor offers equivalent recipe variety at the same price.', response: 'Test whether curation and serving guidance improve discovery and repeat beyond recipe variety alone.', effect: 'Variety no longer distinguishes the offer. The test must isolate the value of discovery and guidance.' },
    { move: 'No response', assumption: 'Competitors make no new move during the test period; existing assortments remain available.', response: 'Compare against separately purchased recipes and existing assortments, including no purchase.', effect: 'There is no added competitive pressure, but launch activity still does not prove incremental demand.' },
  ],
  fresh: [
    { move: 'Matches daily price', assumption: 'An established fresh brand can offer a smaller portion at the same daily feeding budget.', response: 'Compare paid repeat, waste and convenience at matched feeding budgets.', effect: 'A price advantage disappears. The fresh-versus-pantry test must establish another useful difference.' },
    { move: 'Expands distribution', assumption: 'An incumbent becomes available in the same target stores with a workable cold chain.', response: 'Include the newly accessible incumbent and measure availability, spoilage and contribution.', effect: 'Access becomes less distinctive. Channel costs and reliable availability matter more in the comparison.' },
    { move: 'No response', assumption: 'Competitor prices and distribution remain unchanged during the test.', response: 'Keep current fresh and pantry substitutes in the matched-budget comparison.', effect: 'Existing purchases support category demand, but the proposed offer still needs its own repeat and economics evidence.' },
  ],
  dental: [
    { move: 'Matches price + cites evidence', assumption: 'The incumbent matches price and highlights evidence accepted for its specific product and claim.', response: 'Establish this product’s own benefit and test whether a measurable difference matters in paid choice.', effect: 'The incumbent retains its evidence advantage. Advancement remains held pending substantiation.' },
    { move: 'Adds promotion', assumption: 'An established dental product temporarily lowers its effective purchase price.', response: 'Compare regular-price replenishment after promotions end and account for the incumbent discount.', effect: 'Promotional trial could overstate durable preference. Full-price repeat becomes the decisive measure.' },
    { move: 'No response', assumption: 'The incumbent changes neither price nor promotion during the test.', response: 'Use the closest accepted incumbent as the active comparator for the intended claim.', effect: 'The substantiation requirement remains. No competitor response does not validate this product’s benefit.' },
  ],
  pantry: [
    { move: 'Matches format + discounts', assumption: 'An existing pantry brand matches the portion format and discounts it.', response: 'Compare useful serving guidance, leftovers and repeat at feasible channel costs.', effect: 'Format alone offers little protection. A useful household advantage must survive the discount.' },
    { move: 'Expands assortment', assumption: 'An incumbent supplies comparable portions and more recipes.', response: 'Test the proposed portion and guidance against the expanded incumbent assortment.', effect: 'Assortment breadth becomes harder to distinguish. Do not infer a new market gap.' },
    { move: 'No response', assumption: 'The competitive assortment remains unchanged during the test.', response: 'Compare against current toppers, meals and partial-ration fresh, including no purchase.', effect: 'Existing substitutes still set the standard. Incrementality and feasible costs remain unproven.' },
  ],
};
export function competitorScenario(id: string, move?: string): CompetitorScenario {
  const choices = competitorScenarios[id];
  if (!choices) throw new Error('Unknown opportunity');
  return choices.find(choice => choice.move === move) || choices[0];
}
