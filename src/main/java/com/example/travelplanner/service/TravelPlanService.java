package com.example.travelplanner.service;

import com.example.travelplanner.repository.TravelPlanRepository;
import com.example.travelplanner.model.TravelPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelPlanService {

    private final TravelPlanRepository travelPlanRepository;

    // Create
    public TravelPlan createTravelPlan(TravelPlan travelPlan) {
        return travelPlanRepository.save(travelPlan);
    }

    // Read All (Recently added first)
    public List<TravelPlan> getAllTravelPlans() {
        return travelPlanRepository.findAllByOrderByIdDesc();
    }

    // Read One
    public TravelPlan getTravelPlanById(String id) {
        return travelPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Travel plan not found"));
    }

    // Update
    public TravelPlan updateTravelPlan(String id, TravelPlan travelPlan) {

        TravelPlan existingPlan = getTravelPlanById(id);

        existingPlan.setTitle(travelPlan.getTitle());
        existingPlan.setDestination(travelPlan.getDestination());
        existingPlan.setStartLocation(travelPlan.getStartLocation());
        existingPlan.setStartDate(travelPlan.getStartDate());
        existingPlan.setEndDate(travelPlan.getEndDate());
        existingPlan.setBudget(travelPlan.getBudget());
        existingPlan.setTransport(travelPlan.getTransport());
        existingPlan.setStatus(travelPlan.getStatus());
        existingPlan.setItinerary(travelPlan.getItinerary());
        existingPlan.setExpenses(travelPlan.getExpenses());

        return travelPlanRepository.save(existingPlan);
    }

    // Delete
    public void deleteTravelPlan(String id) {
        travelPlanRepository.deleteById(id);
    }
}
